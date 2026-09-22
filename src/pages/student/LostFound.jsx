import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageSearch, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getItemsForUniversity, subscribeToLostFound } from '../../services/lostFoundService';
import { LOST_FOUND_CATEGORIES } from '../../data/mockData';
import LostFoundCard from '../../components/LostFoundCard';
import EmptyState from '../../components/EmptyState';
import SearchBar from '../../components/SearchBar';
import FilterPills from '../../components/FilterPills';
import Button from '../../components/Button';

const TYPE_FILTERS = ['All', 'Lost', 'Found'];

export default function LostFound() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [query, setQuery] = useState('');

  const load = async () => {
    const data = await getItemsForUniversity(user.universityId);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const unsub = subscribeToLostFound(user.universityId, load);
    return unsub;
  }, [user.universityId]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesType = typeFilter === 'All' || i.type === typeFilter;
      const matchesCategory = categoryFilter === 'All' || i.category === categoryFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || i.title.toLowerCase().includes(q) || i.location.toLowerCase().includes(q);
      return matchesType && matchesCategory && matchesQuery;
    });
  }, [items, typeFilter, categoryFilter, query]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Lost &amp; Found</h1>
          <p>Search for something you lost, or help reunite someone with theirs.</p>
        </div>
        <Link to="/app/lost-found/new"><Button variant="primary" icon={Plus}>Post an Item</Button></Link>
      </div>

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} placeholder="Search for an item..." />
      </div>
      <div className="toolbar">
        <FilterPills options={TYPE_FILTERS} active={typeFilter} onChange={setTypeFilter} />
      </div>
      <div className="toolbar">
        <FilterPills options={['All', ...LOST_FOUND_CATEGORIES]} active={categoryFilter} onChange={setCategoryFilter} />
      </div>

      {!loading && filtered.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No items found."
          description="Try a different search, or be the first to post."
          action={<Link to="/app/lost-found/new"><Button variant="primary" size="sm">Post an Item</Button></Link>}
        />
      ) : (
        <div className="grid-auto">
          {filtered.map((i) => <LostFoundCard key={i.id} item={i} />)}
        </div>
      )}
    </div>
  );
}