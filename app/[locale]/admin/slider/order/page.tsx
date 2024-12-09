'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { GripVertical } from 'lucide-react';

interface Slider {
  id: number;
  link: string | null;
  photo: string | null;
  is_active: number;
  order_by: number | null;
}

export default function SliderOrderPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    const res = await fetch('/api/admin/slider');
    const data = await res.json();
    setSliders(data);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sliders);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order_by: index + 1,
    }));

    setSliders(updatedItems);

    await fetch('/api/admin/slider/reorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: updatedItems }),
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Slider Sıralama</h1>
        <Link href="/admin/slider" className="bg-blue-500 text-white px-4 py-2 rounded">
          Slider Listesine Dön
        </Link>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sliders">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {sliders.map((slider, index) => (
                <Draggable key={slider.id} draggableId={String(slider.id)} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-center gap-4 bg-white p-4 rounded border"
                    >
                      <div {...provided.dragHandleProps}>
                        <GripVertical className="h-5 w-5 text-gray-500" />
                      </div>
                      
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
                        <div>{slider.link}</div>
                        <div className="text-sm text-gray-500">Sıra: {index + 1}</div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}