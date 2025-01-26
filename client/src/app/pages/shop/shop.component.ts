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
      image: 'assets/images/coffee_cup.png'
    },
    {
      id: 2,
      name: '1 Month Free of SouthVPN',
      cost: 5000,
      image: 'assets/images/south_vpn.png'
    },
    {
      id: 3,
      name: 'Iphone 18',
      cost: 10000000,
      image: 'assets/images/iphone_20.png'
    }
  ];
  redeem(product: any) {
    console.log('Added to cart:', product);
    // Add your cart logic here
  }
}

