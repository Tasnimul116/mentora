
import React, { useState, useRef } from 'react';
import { ChevronDown, PlayCircle } from 'lucide-react';

export default function CourseContentAccordion({ sections }) {
  const [openSections, setOpenSections] = useState(new Set());
  const sectionRefs = useRef([]); // To store refs for scrolling

  const toggleSection = (index) => {
    const newOpenSections = new Set(openSections);
    let justOpened = false;

    if (newOpenSections.has(index)) {
      newOpenSections.delete(index);
    } else {
      newOpenSections.add(index);
      justOpened = true; // Flag that we just opened this one
    }
    setOpenSections(newOpenSections);

    // Scroll to the section when it's opened
    if (justOpened) {
      setTimeout(() => { // Use timeout to wait for render
        sectionRefs.current[index]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest', // Aligns to the top or bottom, whichever is nearest
        });
      }, 100); // 100ms delay to ensure element is ready
    }
  };

  return (
    <div id="course-content">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Content</h2>
      <div className="space-y-3">
        {sections.map((section, index) => {
          const isOpen = openSections.has(index);
          return (
            <div 
              key={index} 
              ref={el => sectionRefs.current[index] = el}
              className="border border-gray-200 rounded-lg overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 focus:outline-none cursor-pointer" // <-- Added cursor-pointer
              >
                <div className="flex-1 pr-4">
                  <h4 className="font-bold text-gray-900 text-lg">{section.title}</h4>
                  <span className="text-sm text-gray-600 font-medium">{section.lessons} lessons • {section.hours}h</span>
                </div>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {/* Conditional Content (The Lessons) */}
              {isOpen && (
                <div className="bg-gray-50 p-4 border-t border-gray-200">
                  <ul className="space-y-3">
                    {section.lessonsList.map((lesson) => (
                      <li key={lesson.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <PlayCircle size={18} className="text-blue-600" />
                          <span className="text-gray-700">{lesson.title}</span>
                        </div>
                        <span className="text-sm text-gray-500">{lesson.duration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}