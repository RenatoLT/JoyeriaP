import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './components/Home.jsx'
import Newsletter from './components/newsletter.jsx'
import Catalog from './components/Catalog.jsx'
import Findus from './components/Findus.jsx'
import Contact from './components/Contact.jsx'
import SignIn from './components/SignIn.jsx'
import LogIn from './components/LogIn.jsx'
import AboutUs from './components/AboutUs.jsx'
import Cart from './components/Cart.jsx'
import Producto from './components/Product.jsx'
import BackOffice from './components/BackOffice.jsx'
import Checkout from './components/Checkout.jsx'
import Blogs from './components/Blogs.jsx'
import BlogDetail from './components/BlogDetail.jsx'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/findus" element={<Findus />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/product/:id" element={<Producto />} />
      <Route path="/backoffice" element={<BackOffice />} />
      <Route path="/checkout" element={<Checkout />} />

    </Routes>
    <Newsletter />
    <Footer />
    </>
  )
}

export default App
