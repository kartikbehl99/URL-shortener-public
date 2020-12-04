import { UrlShorteningService } from './../url-shortening.service';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormControlDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-url-input',
  templateUrl: './url-input.component.html',
  styleUrls: ['./url-input.component.scss'],
})
export class UrlInputComponent implements OnInit {
  urlRegex =
    '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|(www\\.)?){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?';
  isLoading = false;
  isMobile = false;
  shortUrl: string;

  urlFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.urlRegex),
  ]);

  constructor(
    private urlShorteningService: UrlShorteningService,
    private breakpointObserver: BreakpointObserver,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe('(max-width: 600px)')
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  getShortUrl(): void {
    if (this.urlFormControl.valid) {
      const urlContainer = document.getElementById('short-url');
      urlContainer.innerText = '';

      this.isLoading = true;
      const body = {
        long_url: this.urlFormControl.value,
      };
      this.urlFormControl.disable();

      this.urlShorteningService.generateShortUrl(body).subscribe((data) => {
        this.isLoading = false;

        const shortUrl = window.location.href + data.short_url;
        urlContainer.innerText = shortUrl;

        this.urlShorteningService.shortUrl = shortUrl;
        this.shortUrl = shortUrl;

        this.urlFormControl.enable();
      });
    }
  }

  notifyCopy(): void {
    this.snackbar.open('Copied to clipboard!', 'Close', { duration: 2000 });
  }
}
