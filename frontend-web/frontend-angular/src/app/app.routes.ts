import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { PostDashboardComponent } from './components/post-dashboard/post-dashboard.component';
import { ReviewComponent } from './components/review/review.component';
import { DraftComponent } from './components/draft/draft.component';
import { EditDraftComponent } from './components/edit-draft/edit-draft.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: PostDashboardComponent},
  { path: 'add-post', component: AddPostComponent },
  { path: 'review', component: ReviewComponent },
  { path: 'draft', component: DraftComponent},
  { path: 'edit-draft/:id', component: EditDraftComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
