import { Component, inject, OnInit } from '@angular/core';
import { GithubService } from '../../service/github/github.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sobre-mi',
  imports: [FormsModule],
  templateUrl: './sobre-mi.component.html',
  styleUrl: './sobre-mi.component.css'
})
export class SobreMiComponent implements OnInit{

  apiService = inject(GithubService);

  ngOnInit(): void {
    this.apiService.getData();
  }
}
