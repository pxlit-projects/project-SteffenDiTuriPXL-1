import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostEditorComponent } from './components/post-editor/post-editor.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { PostDashboardComponent } from './components/post-dashboard/post-dashboard.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: PostDashboardComponent},
  { path: 'edit/:id', component: PostEditorComponent },
  { path: 'create', component: PostEditorComponent },
  { path: 'add-post', component: AddPostComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
