'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Pencil } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import Image from 'next/image';

interface Slider {
  id: number;
  link: string | null;
  photo: string | null;
  is_active: number;
  order_by: number | null;
}

export default function SliderPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Slider>>({});
  const [newSlider, setNewSlider] = useState<{
    link: string;
    photo: File | null;
  }>({
    link: '',
    photo: null,
  });

  // Slider verilerini çek
  const fetchSliders = async () => {
    const res = await fetch('/api/admin/slider');
    const data = await res.json();
    setSliders(data);
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // Yeni slider ekleme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('link', newSlider.link);
    if (newSlider.photo) {
      formData.append('photo', newSlider.photo);
    }

    await fetch('/api/admin/slider', {
      method: 'POST',
      body: formData,
    });

    setNewSlider({ link: '', photo: null });
    fetchSliders();
  };

  // Slider düzenleme
  const handleEdit = async (id: number) => {
    if (isEditing === id) {
      const formData = new FormData();
      formData.append('link', editForm.link || '');
      if (editForm.photo instanceof File) {
        const fileExtension = editForm.photo.name.split('.').pop();if (editForm.photo instanceof File) {
            const fileExtension = editForm.photo.name.split('.').pop();
            const mimeType = editForm.photo.type;
            formData.append('photo', new File([editForm.photo], editForm.photo.name, { type: mimeType }));
        } else {
            // Handle the case where editForm.photo is not a File
        }
        const mimeType = editForm.photo.type;
        formData.append('photo', new File([editForm.photo], editForm.photo.name, { type: mimeType }));
      }

      await fetch(`/api/admin/slider/${id}`, {
        method: 'PUT',
        body: formData,
      });

      setIsEditing(null);
      setEditForm({});
      fetchSliders();
    } else {
      const slider = sliders.find(s => s.id === id);
      setEditForm(slider || {});
      setIsEditing(id);
    }
  };

  // Slider silme
  const handleDelete = async (id: number) => {
    if (confirm('Bu slider\'ı silmek istediğinizden emin misiniz?')) {
      await fetch(`/api/admin/slider/${id}`, {
        method: 'DELETE',
      });
      fetchSliders();
    }
  };

  // Aktiflik durumunu değiştirme
  const toggleActive = async (id: number, currentStatus: number) => {
    await fetch(`/api/admin/slider/${id}/toggle`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_active: currentStatus === 1 ? 0 : 1 }),
    });
    fetchSliders();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Slider Yönetimi</h1>
        <Link href="/admin/slider/order" className="bg-blue-500 text-white px-4 py-2 rounded">
          Sıralamayı Düzenle
        </Link>
      </div>

      {/* Yeni Slider Ekleme Formu */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Yeni Slider Ekle</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Link</label>
            <Input
              type="text"
              value={newSlider.link}
              onChange={(e) => setNewSlider(prev => ({ ...prev, link: e.target.value }))}
            />
          </div>
          <div>
            <label className="block mb-2">Fotoğraf</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setNewSlider(prev => ({ ...prev, photo: e.target.files?.[0] || null }))}
            />
          </div>
          <Button type="submit">Ekle</Button>
        </div>
      </form>

      {/* Slider Listesi */}
      <div className="space-y-4">
        {sliders.map((slider) => (
          <div key={slider.id} className="border rounded p-4 flex items-center gap-4">
            {slider.photo && (
              <div className="w-24 h-24 relative">
                <Image
                  src={slider.photo}
                  alt="Slider"
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            
            <div className="flex-1">
              {isEditing === slider.id ? (
                <div className="space-y-2">
                  <Input
                    type="text"
                    value={editForm.link || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, link: e.target.value }))}
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditForm(prev => ({ ...prev, photo: e.target.files?.[0] }))}
                  />
                </div>
              ) : (
                <div>{slider.link}</div>
              )}
            </div>

            <Switch
              checked={slider.is_active === 1}
              onCheckedChange={() => toggleActive(slider.id, slider.is_active)}
            />

            <Button
              variant="outline"
              size="icon"
              onClick={() => handleEdit(slider.id)}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(slider.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}