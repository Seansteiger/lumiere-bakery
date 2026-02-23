import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { pb } from '@/lib/pocketbase';

interface Variation {
    name: string;
    options: string[];
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: any;
    onSave: () => void;
}

export default function ProductModal({ isOpen, onClose, product, onSave }: ProductModalProps) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [promoPrice, setPromoPrice] = useState('');
    const [category, setCategory] = useState('');
    const [inStock, setInStock] = useState(true);
    const [isHot, setIsHot] = useState(false);

    // Variations
    const [variations, setVariations] = useState<Variation[]>([]);
    const [newVarName, setNewVarName] = useState('');
    const [newVarOptions, setNewVarOptions] = useState('');

    // Image upload
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (product) {
            setName(product.name || '');
            setSlug(product.slug || '');
            setDescription(product.description || '');
            setPrice(product.price ? product.price.toString() : '');
            setPromoPrice(product.promo_price ? product.promo_price.toString() : '');
            setCategory(product.category || '');
            setInStock(product.in_stock ?? true);
            setIsHot(product.is_hot ?? false);
            setVariations(product.variations || []);

            // Set image preview from file or fallback to url
            if (product.image_file) {
                setImagePreview(pb.files.getURL(product, product.image_file));
            } else if (product.image) {
                setImagePreview(product.image);
            } else {
                setImagePreview('');
            }
            setImageFile(null);
        } else {
            resetForm();
        }
    }, [product, isOpen]);

    const resetForm = () => {
        setName('');
        setSlug('');
        setDescription('');
        setPrice('');
        setPromoPrice('');
        setCategory('');
        setInStock(true);
        setIsHot(false);
        setVariations([]);
        setImagePreview('');
        setImageFile(null);
        setNewVarName('');
        setNewVarOptions('');
        setError('');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addVariation = () => {
        if (!newVarName.trim() || !newVarOptions.trim()) return;
        const optionsArray = newVarOptions.split(',').map(o => o.trim()).filter(Boolean);
        if (optionsArray.length === 0) return;

        setVariations([...variations, { name: newVarName.trim(), options: optionsArray }]);
        setNewVarName('');
        setNewVarOptions('');
    };

    const removeVariation = (index: number) => {
        setVariations(variations.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('slug', slug);
            formData.append('description', description);
            formData.append('price', price);
            if (promoPrice) formData.append('promo_price', promoPrice);
            if (category) formData.append('category', category);
            formData.append('in_stock', inStock.toString());
            formData.append('is_hot', isHot.toString());
            formData.append('variations', JSON.stringify(variations));

            if (imageFile) {
                formData.append('image_file', imageFile);
                // Option: clear the text url when a file is uploaded
                formData.append('image', '');
            }

            if (product?.id) {
                await pb.collection('products').update(product.id, formData);
            } else {
                await pb.collection('products').create(formData);
            }

            onSave();
            onClose();
        } catch (err: any) {
            console.error("Save product error:", err);
            setError(err.message || "Failed to save product.");
        } finally {
            setIsSaving(false);
        }
    };

    // Auto-generate slug from name if empty
    const handleNameChange = (val: string) => {
        setName(val);
        if (!product && !slug) {
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#1a120b] w-full max-w-3xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold mb-6 border border-red-100 dark:border-red-900 dark:bg-red-500/10">
                            {error}
                        </div>
                    )}

                    <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Product Image</label>
                            <div
                                className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {imagePreview ? (
                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden mb-4 shadow-sm border border-slate-200 dark:border-white/5">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <Upload className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                        <Upload className="w-8 h-8 text-primary" />
                                    </div>
                                )}
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to upload image</p>
                                <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP up to 5MB</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Name *</label>
                                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary" value={name} onChange={e => handleNameChange(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Slug *</label>
                                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary" value={slug} onChange={e => setSlug(e.target.value)} placeholder="e.g. chocolate-cake" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                            <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary relative z-10" value={description} onChange={e => setDescription(e.target.value)} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Price (R) *</label>
                                <input required type="number" step="0.01" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary" value={price} onChange={e => setPrice(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Promo Price (R)</label>
                                <input type="number" step="0.01" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary" value={promoPrice} onChange={e => setPromoPrice(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Cakes" />
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" checked={inStock} onChange={e => setInStock(e.target.checked)} />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">In Stock</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" checked={isHot} onChange={e => setIsHot(e.target.checked)} />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Is Hot (Featured)</span>
                            </label>
                        </div>

                        {/* Variations Builder */}
                        <div className="border-t border-slate-100 dark:border-white/5 pt-6 mt-6">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Product Variations</h3>

                            {/* Existing Variations */}
                            <div className="space-y-3 mb-4">
                                {variations.map((v, i) => (
                                    <div key={i} className="flex items-start justify-between bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-100 dark:border-white/5">
                                        <div>
                                            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{v.name}: </span>
                                            <span className="text-sm text-slate-600 dark:text-slate-400">{v.options.join(', ')}</span>
                                        </div>
                                        <button type="button" onClick={() => removeVariation(i)} className="text-slate-400 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Variation Form */}
                            <div className="flex items-end gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Variation Name</label>
                                    <input type="text" placeholder="e.g. Flavor, Size" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a120b] outline-none text-sm" value={newVarName} onChange={e => setNewVarName(e.target.value)} />
                                </div>
                                <div className="flex-[2]">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Options (comma separated)</label>
                                    <input type="text" placeholder="e.g. Vanilla, Chocolate, Strawberry" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a120b] outline-none text-sm" value={newVarOptions} onChange={e => setNewVarOptions(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addVariation())} />
                                </div>
                                <button type="button" onClick={addVariation} className="bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white px-3 py-2 rounded-lg font-bold transition-all h-[38px] flex items-center justify-center">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </form>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3 shrink-0 bg-slate-50 dark:bg-[#150f0a] rounded-b-2xl">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/5 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form="product-form" disabled={isSaving} className="px-5 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50">
                        {isSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {product ? 'Save Changes' : 'Create Product'}
                    </button>
                </div>
            </div>
        </div>
    );
}
