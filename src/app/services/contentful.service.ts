import { Injectable } from '@angular/core';
import { ContentfulClientApi, createClient, Entry } from 'contentful';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentfulService {

  private client: ContentfulClientApi;

  constructor() {
    this.client = createClient({
      space: environment.contentful.spaceId,
      accessToken: environment.contentful.token
    });
  }

  public getGallery(entryId: string): Promise<Entry<any>> {
    return this.client.getEntry(entryId);
  }
}
