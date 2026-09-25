import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/useStore'

const categories = ['All', 'Biscuits', 'Cakes', 'Toffees', 'Beverages', 'Other Store Items']
const categoryAliases = {
  Biscuits: ['Biscuits', 'Biscuits & Snacks'],
  Cakes: ['Cakes', 'Bakery Items'],
  Toffees: ['Toffees', 'Candies & Chocolates'],
  Beverages: ['Beverages'],
  'Other Store Items': ['Other Store Items', 'Grocery Items', 'Wholesale Products']
}

function HomeProductCard({ product, onAdd }) {
  return <article className="home-product-card">
    <Link to={`/products/${product.id}`} className="home-product-image"><img src={product.image} alt={product.name} loading="lazy" /><span>{product.category}</span></Link>
    <div className="home-product-copy"><div><Link to={`/products/${product.id}`}><h3>{product.name}</h3></Link><p>{product.description}</p></div><div className="home-product-bottom"><strong>Rs. {Number(product.price).toLocaleString()}</strong><button className="add-button" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to cart`}>+</button></div></div>
  </article>
}

export default function HomePage() {
  const { products, deals, addToCart, ownerSettings } = useStore()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [dealIndex, setDealIndex] = useState(0)
  const filtered = useMemo(() => products.filter(product => {
    const matchesCategory = category === 'All' || categoryAliases[category]?.includes(product.category) || product.category === category
    return matchesCategory && `${product.name} ${product.description}`.toLowerCase().includes(query.trim().toLowerCase())
  }), [products, query, category])
  const visibleDeals = deals.length ? deals : [{ title: 'Better value for your shop', discount: 15 }]
  const deal = visibleDeals[dealIndex % visibleDeals.length]
  const whatsappText = encodeURIComponent('Hello, I would like to place an order from your general store.')

  return <>
    <section className="home-hero"><div><p className="eyebrow">LOCAL STOCK · WHOLESALE VALUE · SAMUNDRI</p><h1>Good things,<br /><em>close to home.</em></h1><p>Daily essentials, bakery favourites, and shop supplies delivered with the care of a local counter.</p><a className="button button-gold" href="#shop">Start shopping</a></div><div className="hero-stamp"><span>OPEN DAILY</span><strong>Fresh<br />stock</strong><small>For homes & shops</small></div></section>
    <section className="home-shop section" id="shop"><div className="home-heading"><div><p className="eyebrow">THE STORE, AT A GLANCE</p><h2>Find your everyday favourites</h2></div><a className="whatsapp-button" href={`https://wa.me/${ownerSettings.phone}?text=${whatsappText}`} target="_blank" rel="noreferrer">Order on WhatsApp</a></div>
      <label className="home-search"><span aria-hidden="true">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search products by name..." aria-label="Search products by name" /><kbd>⌘ K</kbd></label>
      <div className="category-pills" aria-label="Product categories">{categories.map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
      {query || category !== 'All' ? <section className="home-results"><div className="section-heading"><div><p className="eyebrow">SEARCH RESULTS</p><h2>{filtered.length} products found</h2></div></div><div className="home-product-grid">{filtered.map(product => <HomeProductCard key={product.id} product={product} onAdd={addToCart} />)}</div>{!filtered.length && <div className="empty-state"><h2>No products found</h2><p>Try another product name or category.</p></div>}</section> : <>
        <section className="home-featured"><div className="section-heading"><div><p className="eyebrow">HANDPICKED FOR YOU</p><h2>Featured products</h2></div><Link className="text-link" to="/products">View all products →</Link></div><div className="home-product-grid">{products.slice(0, 4).map(product => <HomeProductCard key={product.id} product={product} onAdd={addToCart} />)}</div></section>
        <section className="deal-slider"><div><p className="eyebrow">THIS WEEK'S DEAL</p><h2>{deal.title}</h2><p>Save up to <strong>{deal.discount || 15}%</strong> when you stock up.</p><Link className="button button-outline" to="/products">Explore deals →</Link></div><div className="deal-mark">-{deal.discount || 15}%</div><div className="deal-controls"><button onClick={() => setDealIndex(Math.max(0, dealIndex - 1))} disabled={dealIndex === 0} aria-label="Previous deal">←</button><span>{dealIndex + 1} / {visibleDeals.length}</span><button onClick={() => setDealIndex((dealIndex + 1) % visibleDeals.length)} aria-label="Next deal">→</button></div></section>
      </>}
    </section>
  </>
}
