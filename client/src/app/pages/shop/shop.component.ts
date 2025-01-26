import { Component } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  products = [
    {
      id: 1,
      name: 'Free Coffee!',
      cost: 2000,
      image: 'assets/images/product1.jpg'
    },
    {
      id: 2,
      name: '1 Month Free of SouthVPN',
      cost: 5000,
      image: 'assets/images/product2.jpg'
    },
    {
      id: 3,
      name: 'Iphone 18',
      cost: 10000000,
      image: 'assets/images/product3.jpg'
    }
  ];
  redeem(product: any) {
    console.log('Added to cart:', product);
    // Add your cart logic here
  }
}

