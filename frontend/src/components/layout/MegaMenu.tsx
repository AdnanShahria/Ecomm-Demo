import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useHomeStore } from '../../store/homeStore';

export const MegaMenu: React.FC = () => {
  const { data } = useHomeStore();
  const categories = data?.categories?.items || [];


  return (
    <div className="absolute top-full left-0 w-[500px] hidden group-hover:block bg-white rounded-2xl border-2 border-[var(--accent)] p-4 z-50 transition-all duration-200 opacity-0 group-hover:opacity-100 mt-8 shadow-lg">
      <div className="grid grid-cols-3 gap-3">
        {categories.length > 0 ? (
          categories.slice(0, 9).map((cat) => (
            <Link 
              key={cat.id} 
              to={`/category/${cat.slug}`}
              className="block p-3 rounded-lg border border-gray-100 hover:border-2 hover:border-[var(--accent)] hover:shadow-md transition-all duration-200 bg-gray-50/50 hover:bg-white group/card flex items-center justify-center text-center"
            >
              <h3 className="font-bold text-[var(--primary)] text-xs uppercase tracking-wider group-hover/card:text-[var(--accent)] transition-colors m-0">{cat.name}</h3>
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted col-span-3">No categories available</p>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
        <Link 
          to="/categories" 
          className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-1"
        >
          View All Collections
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
};
