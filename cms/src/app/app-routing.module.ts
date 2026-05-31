import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Documents } from './documents/documents';
import { MessageList } from './messages/message-list/message-list';
import { Contacts } from './contacts/contacts';

import { DocumentEditComponent } from './documents/document-edit/document-edit.component';
import { DocumentDetail } from './documents/document-detail/document-detail';

import { ContactEditComponent } from './contacts/contact-edit/contact-edit.component';
import { ContactDetail } from './contacts/contact-detail/contact-detail';

const appRoutes: Routes = [
    {path: 'documents', component: Documents, children: [
        {path: 'new', component: DocumentEditComponent},
        {path: ':id', component: DocumentDetail},
        {path: ':id/edit', component: DocumentEditComponent}
    ]}, 
    {path: 'messages', component: MessageList},
    {path: 'contacts', component: Contacts, children: [
        {path: 'new', component: ContactEditComponent},
        {path: ':id', component: ContactDetail},
        {path: ':id/edit', component: ContactEditComponent}
    ]},
    {path: '', redirectTo: '/documents', pathMatch: 'full'}
];

@NgModule ({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}