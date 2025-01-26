import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-shop-product',
  templateUrl: './shop-product.component.html',
  styleUrl: './shop-product.component.scss'
})
export class ShopProductComponent {
  @Input() product: any;
  @Output() redeem = new EventEmitter<any>();


  onRedeem() {
    this.redeem.emit(this.product);
  }
}
