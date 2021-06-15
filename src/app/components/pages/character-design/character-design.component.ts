import { Component, OnInit } from '@angular/core';
import { Entry } from 'contentful';
import { GalleryModel } from 'src/app/models/gallery.model';
import { ImageModel } from 'src/app/models/image.model';
import { ContentfulService } from 'src/app/services/contentful.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-character-design',
  templateUrl: './character-design.component.html',
  styleUrls: ['./character-design.component.css']
})
export class CharacterDesignComponent implements OnInit {

  public model: GalleryModel;

  constructor(private contentfulService: ContentfulService) {
    this.model = {
      title: '',
      images: []
    };
  }

  ngOnInit(): void {
    this.contentfulService.getGallery(environment.contentful.entry.characterDesign)
    .then(gallery =>
      this.model = {
        title: gallery.fields.title,
        images: gallery.fields.images.map((image: Entry<any>, i: number) => <ImageModel>{
          idx: i,
          title: image.fields.title,
          description: image.fields.description,
          url: image.fields.file.url
        })});
  }

}
