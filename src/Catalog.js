import React, { useEffect, useState, useRef } from 'react';
import Card from './Card';
import Navbar from './Navbar';
import FileUpload from './FileUpload';
import supabase from './supabaseClient';

export default function Catalog({ user, setUser, csvData, setCsvData }) {
    const [cards, setCards] = useState([]);
    const [product, setProduct] = useState({
        product_url: "",
        product_title: "",
        price_available: "",	
        currency: "",	
        price: "",	
        brand: "",	
        image: "",	
        description: "",	
        quantity: "",	
        users: "",	
        additional_description: "",	
        additional_images: "",
        email: `${user}`,
    });
    const [showsetcatalog, setshowsetcatalog] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const cardGridRef = useRef(null);
    const dropAreaRef = useRef(null);
    const fileInputRef = useRef(null);
    const pagebtnRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(40);


    function handleChange(event) {
        const { name, value } = event.target;
        setProduct(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    async function addproduct() {
        const { data, error } = await supabase
            .from('user_data')
            .insert(product)
            .select();

        if (error) {
            console.error('Error inserting data:', error);
        } else {
            console.log("New product added successfully:", data[0]);
            setCards(prevCards => [
                ...prevCards,
                <Card key={data[0].id} obj={data[0]} setCards={setCards}/>
            ]);
            crossproduct();
        }
    }

    function crossproduct(){
        setProduct({
            product_url: "",
            product_title: "",
            price_available: "",	
            currency: "",	
            price: "",	
            brand: "",	
            image: "",	
            description: "",	
            quantity: "",	
            users: "",	
            additional_description: "",	
            additional_images: "",
            email: `${user}`,
        });
        setshowsetcatalog(!showsetcatalog);
        setImagePreview(null);  // Clear the image preview
    }

    useEffect(() => {
        async function fetchUserData() {
            const { data, error } = await supabase
                .from('user_data')
                .select('*')
                .eq('email', user);

            if (error) {
                console.error('Error fetching data:', error);
            } else {
                setCards(data.map(obj => <Card key={obj.id} obj={obj} setCards={setCards} />));
            }
        }
        if (user) {
            fetchUserData();
        }
    }, [user, setUser]);

    const handleFileParsed = async (data) => {
        const userData = data.map(item => ({ ...item, email: user }));
        const { error } = await supabase
            .from('user_data')
            .insert(userData);

        if (error) {
            console.error('Error inserting data:', error);
        } else {
            setCards(userData.map(obj => <Card key={obj.id} obj={obj} setCards={setCards}/>));
        }
    };

    useEffect(() => {
        if (showsetcatalog) {
            const catalogHeight = document.querySelector('.set-catalog').offsetHeight;
            cardGridRef.current.style.top = `${200 + catalogHeight}px`;
        } else {
            cardGridRef.current.style.top = '200px';
        }
    }, [showsetcatalog]);

    useEffect(()=>{
        if (cards.length > 0) {
            const rowHeight = document.querySelector('.card-grid').offsetHeight;
            if (pagebtnRef.current) {
                pagebtnRef.current.style.top = `${300 + rowHeight}px`;
            }
        }
    }, [cards]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
                setProduct(prevFormData => ({
                    ...prevFormData,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
                setProduct(prevFormData => ({
                    ...prevFormData,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    // Get current cards
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // Calculate total pages
    const totalPages = Math.ceil(cards.length / cardsPerPage);

    return (
        <div className='catalog'>
                    <Navbar setUser={setUser} />
            {showsetcatalog && (
                <div className='set-catalog'>
                    <h2>Product Information</h2>
                    <button className='tick-btn' onClick={addproduct}>✔</button>
                    <button className='cross-btn' onClick={crossproduct}>X</button>
                    <div
                        className={`drop-area ${dragging ? 'drag-over' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        ref={dropAreaRef}
                    >
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" />
                        ) : (
                            <>
                                <p>Drag & drop an image here or click to select</p>
                                <button type="button" onClick={handleButtonClick}>Select Image</button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </>                        
                            )}
                    </div>
                    <div className='product-grid'>
                        <div className="label-container">
                            <span className='addproduct-span'>Product URL</span>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="product_url"
                                value={product.product_url}
                            />
                        </div>
                        <div className="label-container">
                            <span className='addproduct-span'>Product Title</span>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="product_title"
                                value={product.product_title}
                            />
                        </div>
                        <div className="label-container">
                            <span className='addproduct-span'>Price Available</span>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="price_available"
                                value={product.price_available}
                            />
                        </div>
                        <div className="label-container">
                            <span className='addproduct-span'>Currency</span>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="currency"
                                value={product.currency}
                            />
                        </div>
                        <div className="label-container">
                            <span className='addproduct-span'>Price</span>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="price"
                                value={product.price}
                            />
                        </div>
                        <div className="label-container">
                            <span className='addproduct-span'>Brand</span>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="brand"
                                value={product.brand}
                            />
                        </div>
                        <div className="label-container">
                            <span className='addproduct-span'>Image</span>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="image"
                                value={product.image}
                            />
                        </div>
                        <div className="label-container">
                            <span className='addproduct-span'>Description</span>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="description"
                                value={product.description}
                            />
                        </div>
                        <div className="label-container">
                            <span className='addproduct-span'>Quantity</span>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="quantity"
                                value={product.quantity}
                            />
                        </div>
                        <div className="label-container">
                            <span className='addproduct-span'>Users</span>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="users"
                                value={product.users}
                            />
                        </div>
                        <div className="label-container">
                            <span className='addproduct-span'>Additional Description</span>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="additional_description"
                                value={product.additional_description}
                            />
                        </div>
                        <div className="label-container">
                            <span className='addproduct-span'>Additional Images</span>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="additional_images"
                                value={product.additional_images}
                            />
                        </div>
                    </div>
                </div>
            )}
            <FileUpload setCards={setCards} user={user} />
            <button className='product-add' onClick={() => setshowsetcatalog(!showsetcatalog)}>Add Product</button>
            <div className="card-grid" ref={cardGridRef}>
                {currentCards}
            </div>
            {cards.length > 0 && 
            <div className='pagination' ref={pagebtnRef}>
                <button onClick={() => paginate(1)} disabled={currentPage === 1}>
                    First
                </button>
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <button key={pageNumber} onClick={() => paginate(pageNumber)} className={currentPage === pageNumber ? 'active' : ''}>
                        {pageNumber}
                    </button>
                ))}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
                <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>
                    Last
                </button>
            </div>
            }
        </div>
    );
}


/*

 function cardCall(event) {
        const index = event.target.value;
        if (index > 0) {
            const filteredData = csvData.filter(obj => obj.category === `Category ${index}`);
            setCards(filteredData.map(obj => <Card key={obj.id} obj={obj} />));
        } else {
            setCards([]);
        }
    }

<form id="form1" className="category-form">
                    <select onChange={cardCall}>
                        <option value={0}>--Choose an option--</option>
                        <option value={1}>Category 1</option>
                        <option value={2}>Category 2</option>
                        <option value={3}>Category 3</option>
                    </select>
                </form> */
