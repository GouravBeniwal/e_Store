def product_to_dict(product):

    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "category": product.category,
        "image_url": product.image_url,
        "stock": product.stock
    }