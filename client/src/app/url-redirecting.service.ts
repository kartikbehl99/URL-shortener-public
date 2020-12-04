import { appUrl, baseUrl } from './URLs';
import { UrlShorteningService } from './url-shortening.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UrlRedirectingService implements CanActivate {
  constructor(
    private urlShorteningService: UrlShorteningService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const shortUrl: string = route.paramMap.get('short_url');
    if (!shortUrl || shortUrl.trim() === '') {
      return true;
    }
    this.urlShorteningService.handleRedirect(shortUrl).subscribe(() => {
      if (this.urlShorteningService.status === 404) {
        this.router.navigate(['/page/fourofour']).catch();
      } else {
        window.location.href = this.urlShorteningService.longUrl;
      }
      return false;
    });
  }
}
