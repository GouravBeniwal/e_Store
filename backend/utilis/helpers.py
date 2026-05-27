def product_to_dict(product):
    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "category": product.category,
        "subcategory": product.subcategory or "",
        "product_type": product.product_type or "",
        "category_label": product.product_type or product.subcategory or product.category,
        "image_url": product.image_url,
        "stock": product.stock
    }
