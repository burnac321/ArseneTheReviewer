// app/admin/components/UploadForm.tsx
'use client';

import { useState } from 'react';
import { 
  Star, Upload, Link, Image, Video, Save, Send, Plus, Trash2,
  Package, Film, Smartphone, Gamepad2, BookOpen, Globe, DollarSign
} from 'lucide-react';

const REVIEW_TYPES = [
  { id: 'product', label: 'Product', icon: Package, color: 'bg-blue-500' },
  { id: 'movie', label: 'Movie', icon: Film, color: 'bg-purple-500' },
  { id: 'app', label: 'App', icon: Smartphone, color: 'bg-green-500' },
  { id: 'game', label: 'Game', icon: Gamepad2, color: 'bg-red-500' },
  { id: 'book', label: 'Book', icon: BookOpen, color: 'bg-yellow-500' },
];

export default function UploadForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'product',
    itemName: '',
    brand: '',
    rating: 0,
    featuredImage: '',
    featuredVideo: '',
    content: '# Review\n\nStart writing here...',
    links: [{ platform: '', url: '' }],
    pros: [''],
    cons: [''],
    excerpt: '',
    tags: '',
  });

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: new Date().toISOString(),
          author: 'Arsene',
          slug: formData.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-'),
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage(`✅ Published! ${result.url}`);
        // Reset form
        setFormData({
          title: '',
          type: 'product',
          itemName: '',
          brand: '',
          rating: 0,
          featuredImage: '',
          featuredVideo: '',
          content: '# Review\n\nStart writing here...',
          links: [{ platform: '', url: '' }],
          pros: [''],
          cons: [''],
          excerpt: '',
          tags: '',
        });
        setStep(1);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { platform: '', url: '' }]
    }));
  };

  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...formData.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, links: newLinks }));
  };

  const removeLink = (index: number) => {
    if (formData.links.length > 1) {
      setFormData(prev => ({
        ...prev,
        links: prev.links.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🚀 ArseneTheReviewer Upload Portal
          </h1>
          <p className="text-gray-600 mt-2">Create reviews that publish instantly to GitHub</p>
        </header>

        {/* Steps */}
        <div className="flex mb-8 space-x-4">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => setStep(num)}
              className={`flex-1 py-3 rounded-lg font-semibold ${step === num ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              Step {num}: {num === 1 ? 'Basic Info' : num === 2 ? 'Content' : 'Links & Publish'}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Package /> Basic Information
            </h2>
            
            <div>
              <label className="block font-medium mb-2">Review Type</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {REVIEW_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${
                      formData.type === type.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <type.icon className={`h-8 w-8 ${formData.type === type.id ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="mt-2 font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">Review Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="iPhone 15 Pro Review: Worth It?"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  {formData.type === 'movie' ? 'Movie Title' : 'Item Name'} *
                </label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                  className="w-full p-3 border rounded-lg"
                  placeholder={formData.type === 'movie' ? 'Oppenheimer' : 'iPhone 15 Pro'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">
                  {formData.type === 'movie' ? 'Director/Studio' : 'Brand'} *
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full p-3 border rounded-lg"
                  placeholder={formData.type === 'movie' ? 'Christopher Nolan' : 'Apple'}
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Your Rating</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="text-3xl transition-transform hover:scale-110"
                    >
                      {star <= formData.rating ? '⭐' : '☆'}
                    </button>
                  ))}
                  <span className="ml-4 text-xl font-bold">{formData.rating}.0/5.0</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                Next: Add Content →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Content */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Image /> Content & Media
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2">Featured Image URL</label>
                <div className="flex">
                  <input
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                    className="flex-1 p-3 border rounded-l-lg"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    className="px-4 bg-gray-100 border rounded-r-lg"
                    onClick={() => window.open(formData.featuredImage, '_blank')}
                  >
                    👁️
                  </button>
                </div>
                {formData.featuredImage && (
                  <img src={formData.featuredImage} alt="Preview" className="mt-2 rounded-lg max-h-48 object-cover" />
                )}
              </div>

              <div>
                <label className="block font-medium mb-2">Video URL (YouTube/TikTok)</label>
                <input
                  type="url"
                  value={formData.featuredVideo}
                  onChange={(e) => setFormData(prev => ({ ...prev, featuredVideo: e.target.value }))}
                  className="w-full p-3 border rounded-lg"
                  placeholder="https://youtube.com/watch?v=..."
                />
                {formData.featuredVideo && (
                  <p className="mt-2 text-sm text-gray-600 truncate">{formData.featuredVideo}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">Review Content (Markdown)</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full h-64 p-3 border rounded-lg font-mono"
                placeholder="# Review..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2">Pros</label>
                {formData.pros.map((pro, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={pro}
                      onChange={(e) => {
                        const newPros = [...formData.pros];
                        newPros[index] = e.target.value;
                        setFormData(prev => ({ ...prev, pros: newPros }));
                      }}
                      className="flex-1 p-2 border border-green-200 rounded-lg bg-green-50"
                      placeholder="Positive point"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          pros: prev.pros.filter((_, i) => i !== index)
                        }))}
                        className="px-3 bg-red-500 text-white rounded-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, pros: [...prev.pros, ''] }))}
                  className="mt-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                >
                  + Add Pro
                </button>
              </div>

              <div>
                <label className="block font-medium mb-2">Cons</label>
                {formData.cons.map((con, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={con}
                      onChange={(e) => {
                        const newCons = [...formData.cons];
                        newCons[index] = e.target.value;
                        setFormData(prev => ({ ...prev, cons: newCons }));
                      }}
                      className="flex-1 p-2 border border-red-200 rounded-lg bg-red-50"
                      placeholder="Negative point"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          cons: prev.cons.filter((_, i) => i !== index)
                        }))}
                        className="px-3 bg-red-500 text-white rounded-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, cons: [...prev.cons, ''] }))}
                  className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  + Add Con
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 border rounded-lg hover:bg-gray-50"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                Next: Links & Publish →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Links & Publish */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Link /> Where to Buy/Watch
            </h2>

            <div>
              <label className="block font-medium mb-2">Affiliate/Purchase Links</label>
              {formData.links.map((link, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => updateLink(index, 'platform', e.target.value)}
                    className="w-1/3 p-3 border rounded-lg"
                    placeholder="Amazon, Netflix, etc"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                    className="flex-1 p-3 border rounded-lg"
                    placeholder="https://..."
                  />
                  {formData.links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="px-4 bg-red-500 text-white rounded-lg"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLink}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                + Add Link
              </button>
            </div>

            <div>
              <label className="block font-medium mb-2">Excerpt/Summary</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full h-24 p-3 border rounded-lg"
                placeholder="Brief summary for homepage..."
                maxLength={200}
              />
              <p className="text-sm text-gray-500 mt-1">{formData.excerpt.length}/200 characters</p>
            </div>

            <div>
              <label className="block font-medium mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full p-3 border rounded-lg"
                placeholder="tech, apple, smartphone, review"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 border rounded-lg hover:bg-gray-50"
              >
                ← Back
              </button>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={async () => {
                    // Save draft to localStorage
                    localStorage.setItem('arsene_draft', JSON.stringify(formData));
                    setMessage('💾 Draft saved locally!');
                  }}
                  className="px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                >
                  <Save size={18} /> Save Draft
                </button>
                
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> 🚀 Publish Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
