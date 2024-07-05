import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';

export default function Card(props) {
    const [imageIndex, setImageIndex] = useState(0);
    const [hovered, setHovered] = useState(false);

    let badgeText;
    if (props.obj.quantity === 0) {
        badgeText = "SOLD OUT";
    } else if (props.obj.quantity > 0) {
        badgeText = `AVAILABLE ${props.obj.quantity}`;
    }

    const additionalImages = props.obj.additional_images
    .replace(/^\[|\]$/g, '') // Remove the square brackets at the start and end
    .split(',')
    .map(url => url.trim().replace(/^"|"$/g, '')); // Remove any extra spaces and quotes

    const images = [props.obj.image, ...additionalImages];
    const imageUrl = images[imageIndex].replace(/"/g, '');
    //console.log('Cover Image URL:', imageUrl);

    const handleClick = () => {
        window.open(props.obj.product_url, '_blank');
    };

    async function dltitem(){
        const {error} = await supabase
        .from('user_data')
        .delete()
        .eq('product_title',props.obj.product_title)

        if (error) {
            console.error('Error deleting data:', error);
        } else {
            props.setCards(prevCards => prevCards.filter(card => card.props.obj.product_title !== props.obj.product_title));
        }
    }

    useEffect(() => {
        let timer;
        if (hovered) {
            timer = setInterval(() => {
                setImageIndex(prevIndex => (prevIndex + 1) % images.length);
            }, 1000); // Change image every 1 second
        }
        return () => clearInterval(timer);
    }, [hovered, images.length]);

    return (
        <div 
            className="card" 
            onMouseEnter={() => setHovered(true)} 
            onMouseLeave={() => setHovered(false)}
        >
            <img src={imageUrl} alt="" className="card-photo" onClick={handleClick} />
            {badgeText && <button className="btn">{badgeText}</button>}
            {props.obj.price_available && <p className='card-price'><b>From {props.obj.currency} {props.obj.price}</b></p>}
            <i className='fa fa-trash' onClick={dltitem}></i>
            <p className='card-title'>{props.obj.product_title}</p>
            <p className='card-description'>{props.obj.description}</p>
        </div>
    );
}
