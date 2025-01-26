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
  @Output() address: Address = {} as Address;

  addressControl = new FormControl();
  apartmentNumberControl = new FormControl();
  suggestions: any[] = [];
  showSuggestionsList = false;

  constructor(private mapBoxService: MapBoxService) {}

  getAddress() {
    return this.address;
  }

  ngOnInit(): void {
    if (this.initialPlaceName) {
      this.addressControl.setValue(this.initialPlaceName);
      this.address.place = this.initialPlaceName;
    }
    if (this.initialApartmentNumber) {
      this.apartmentNumberControl.setValue(this.initialApartmentNumber);
      this.address.latitude = 0;
      this.address.longitude = 0;
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
      longitude: suggestion.geometry.coordinates[0],
      latitude: suggestion.geometry.coordinates[1],
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


}
