import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();
  //documentChangedEvent = new EventEmitter<Document[]>();

  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor(private httpClient: HttpClient) {
    //this.documents = MOCKDOCUMENTS;

    //this.maxDocumentId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;

    for (const document of this.documents) {
      const currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addDocument(newDocument: Document) {
    if (newDocument === undefined || newDocument === null) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);

    //const documentsListClone = this.documents.slice();
    //this.documentListChangedEvent.next(documentsListClone);

    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (originalDocument === undefined || originalDocument === null ||
      newDocument === undefined || newDocument === null) 
    {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    const documentsListClone = this.documents.slice();

    //this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }

  getDocuments() {
    this.httpClient.get<Document[]>('https://wdd-430-cms-b7c30-default-rtdb.firebaseio.com/documents.json').subscribe((documents: Document[]) => {
      this.documents = documents;
      this.maxDocumentId = this.getMaxId();
      this.documents.sort((a, b) => {
        if (a < b) {
          return -1;
        }

        else if (a > b) {
          return 1;
        }

        else {
          return 0;
        }
      });

      this.documentListChangedEvent.next(this.documents.slice());
      }, 
      (error: any) => {
        console.log(error);
      }
    );

    //return this.documents.slice();
  }

  storeDocuments() {
    const documentsString = JSON.stringify(this.documents);
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.httpClient.put('https://wdd-430-cms-b7c30-default-rtdb.firebaseio.com/documents.json', 
      documentsString,
    {
      headers: headers
    }).subscribe(() => {
        this.documentListChangedEvent.next(this.documents.slice());
    });
  }

  getDocument(id: string) {
    for(const document of this.documents) {
      if(document.id === id) {
        return document;
      }
    }

    return null;
  }

  /*deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);
    this.documentChangedEvent.emit(this.documents.slice());
  }*/

  deleteDocument(document: Document) {
    if (document === undefined || document === null) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);
    const documentsListClone = this.documents.slice();

    //this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }
}
