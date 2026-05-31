import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  standalone: false,
  templateUrl: './contact-detail.html',
  styleUrl: './contact-detail.css',
})
export class ContactDetail implements OnInit {
  constructor(private contactService: ContactService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  contact: Contact;

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.contact = this.contactService.getContact(id);

    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.contact = this.contactService.getContact(params['id']);
      }
    );
  }
  
  onDelete() {
    this.contactService.deleteContact(this.contact);
    this.router.navigateByUrl('/contacts');
  }
}
