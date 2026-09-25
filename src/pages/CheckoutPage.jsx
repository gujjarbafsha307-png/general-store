import { useState } from 'react'
import { useStore } from '../context/useStore'

export default function CheckoutPage() {
  const { session, cart, cartTotal, submitOrder, getLocation } = useStore()
  const [form, setForm] = useState({ name: session.name || '', phone: session.phone || '', shopName: session.shop_name || '', address: session.delivery_address || session.address || '' })
  const [location, setLocation] = useState('Location not added')
  const [busy, setBusy] = useState(false)
  const update = event => setForm({ ...form, [event.target.name]: event.target.value })
  const locate = async () => { setBusy(true); setLocation(await getLocation()); setBusy(false) }
  const submit = event => { event.preventDefault(); submitOrder({ ...form, address: form.address, location }) }
  return <section className="section checkout-page"><div className="page-title"><p className="eyebrow">ALMOST THERE</p><h1>Complete your order</h1><p className="muted">Tell us where to send your basket and we will confirm it shortly.</p></div><div className="checkout-layout"><form className="checkout-form" onSubmit={submit}><div className="checkout-form-grid"><label>Customer name<input required name="name" value={form.name} onChange={update} /></label><label>Phone number<input required name="phone" value={form.phone} onChange={update} inputMode="tel" /></label><label className="full-field">Shop name<input required name="shopName" value={form.shopName} onChange={update} placeholder="Your shop or business name" /></label><label className="full-field">Delivery address<textarea required name="address" value={form.address} onChange={update} placeholder="Street, area, and city" /></label></div><div className="location-box"><div><strong>Current GPS location</strong><p>{location}</p></div><button type="button" className="button button-small" onClick={locate} disabled={busy}>{busy ? 'Locating...' : 'Use my location'}</button></div><button className="button button-gold wide-button" disabled={!cart.length}>Place order →</button></form><aside className="summary checkout-summary"><h2>Order summary</h2>{cart.map(item => <div className="mini-item" key={item.id}><span>{item.quantity} × {item.name}</span><strong>Rs. {(item.price * item.quantity).toLocaleString()}</strong></div>)}<hr /><div className="summary-total"><span>Total</span><strong>Rs. {cartTotal.toLocaleString()}</strong></div></aside></div></section>
}
