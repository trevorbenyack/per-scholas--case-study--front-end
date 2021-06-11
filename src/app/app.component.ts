import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'caseStudy-FrontEnd';

  ngOnInit() {
    this.loadJsFile("assets/js/soft-ui-dashboard.js")
  }

  // source for idea: https://www.c-sharpcorner.com/blogs/external-js-files-are-not-loading-correctly-in-angular
  public loadJsFile(url: string) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    // @ts-ignore
    document.getElementById('creativeTim').appendChild(node);
  }

}
