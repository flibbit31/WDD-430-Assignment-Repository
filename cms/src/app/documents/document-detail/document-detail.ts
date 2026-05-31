import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { WindRefService } from '../../wind-ref.service';
@Component({
  selector: 'cms-document-detail',
  standalone: false,
  templateUrl: './document-detail.html',
  styleUrl: './document-detail.css',
})
export class DocumentDetail implements OnInit {
  document: Document;
  nativeWindow: any;

  constructor(private documentService: DocumentService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private windRefService: WindRefService) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.document = this.documentService.getDocument(params['id']);
      }
    );

    this.nativeWindow = this.windRefService.getNativeWindow();
  }

  onView() {
    if (this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
  }
}
