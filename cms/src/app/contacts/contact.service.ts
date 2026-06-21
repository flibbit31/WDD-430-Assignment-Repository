import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  //contactChangedEvent = new EventEmitter<Contact[]>();

  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  constructor(private httpClient: HttpClient) {
    this.contacts = MOCKCONTACTS;

    //this.maxContactId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;

    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addContact(newContact: Contact) {
    if (newContact === undefined || newContact === null) {
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);

    //const contactsListClone = this.contacts.slice();
    //this.contactListChangedEvent.next(contactsListClone);

    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (originalContact === undefined || originalContact === null ||
      newContact === undefined || newContact === null)
    {
      return;
    }
    
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    const contactsListClone = this.contacts.slice();

    //this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts();
  }

  getContacts() {
    this.httpClient.get<Contact[]>('https://wdd-430-cms-b7c30-default-rtdb.firebaseio.com/contacts.json').subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
      this.maxContactId = this.getMaxId();
      this.contacts.sort((a, b) => {
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

      this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  storeContacts() {
    const contactsString = JSON.stringify(this.contacts);
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.httpClient.put('https://wdd-430-cms-b7c30-default-rtdb.firebaseio.com/contacts.json',
      contactsString,
    {
      headers: headers
    }).subscribe(() => {
      this.contactListChangedEvent.next(this.contacts.slice());
    });
  }

  getContact(id: string): Contact {
    for(const contact of this.contacts) {
      if(contact.id === id) {
        return contact;
      }
    }

    return null;
  }

  /*deleteContact(contact: Contact) {
    if(!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.contactChangedEvent.emit(this.contacts.slice());
  }*/

  deleteContact(contact: Contact) {
    if (contact === undefined || contact === null) {
      return;
    }

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }

    this.contacts.splice(pos, 1);
    const contactsListClone = this.contacts.slice();

    //this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts();
  }
}
