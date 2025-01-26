import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Address } from '../../interfaces/address';
import { FormControl } from '@angular/forms';
import { MapBoxService } from '../../services/map-box.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-address-autocomplete',
  templateUrl: './address-autocomplete.component.html',
  styleUrl: './address-autocomplete.component.scss',
})
export class AddressAutocompleteComponent implements OnInit {
  @Input() initialPlaceName: string | null = '';
  @Input() initialApartmentNumber: string | null = '';
  @Output() addressSelected = new EventEmitter<Address>();

  addressControl = new FormControl();
  apartmentNumberControl = new FormControl();
  suggestions: any[] = [];
  private address: Address = {} as Address;
  showSuggestionsList = false;

  constructor(private mapBoxService: MapBoxService) {}

  ngOnInit(): void {
    if (this.initialPlaceName) {
      this.addressControl.setValue(this.initialPlaceName);
      this.address.place = this.initialPlaceName;
    }
    if (this.initialApartmentNumber) {
      this.apartmentNumberControl.setValue(this.initialApartmentNumber);
      this.address.location = [0, 0];
    }

    this.addressControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.mapBoxService.searchPlace(value).subscribe((response: any) => {
            this.suggestions = response.features;
          });
        } else {
          this.suggestions = [];
        }
      });
  }

  selectSuggestion(suggestion: any): void {
    this.address = {
      location: suggestion.geometry.coordinates,
      place: suggestion.place_name,
    };
    this.addressControl.setValue(suggestion.place_name);
    this.addressSelected.emit(this.address);
    this.suggestions = [];
    this.showSuggestionsList = false; // Hide the suggestions list immediately
  }

  showSuggestions(): void {
    this.showSuggestionsList = true;
  }

  hideSuggestions(): void {
    setTimeout(() => {
      this.showSuggestionsList = false;
    }, 2000);
  }

  setApartmentNumber(event: any): void {
    const updatedAddress = {
      ...this.address,
      apartmentNumber: event.target.value,
    };
    this.addressSelected.emit(updatedAddress);
  }
}
