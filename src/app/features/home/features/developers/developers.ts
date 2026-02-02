import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, FoxcodeCard } from '../../../../shared';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'foxcode-developers',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, FoxcodeCard],
  templateUrl: './developers.html',
  styleUrls: ['developers.scss']
})
export class Developers {
  private alert = inject(AlertService);

  public people: Person[] = [
    // Frist shift
    {
      name: 'Omar salazar',
      position: 'Coordinador de desarrollo de aplicaciones',
      role: 'Coordinator',
      shift: '1st',
      mail: 'omar.e.salazar@fii-na.com',
      imageUrl: 'assets/developers/salazar.png'
    },
    {
      name: 'Omar Aldaba',
      position: 'Ingeniero senior de desarrollo de aplicaciones',
      role: 'Developer',
      shift: '1st',
      mail: 'omar.aldaba@fii-na.com',
      imageUrl: 'assets/developers/omaraldaba.jpg'
    },
    {
      name: 'Alejandro Lopez',
      position: 'Ingeniero senior de desarrollo de aplicaciones',
      role: 'Developer',
      shift: '1st',
      mail: 'jaime.a.lopez@fii-na.com',
      imageUrl: 'assets/developers/alejandrolopez.jpg'
    },
    {
      name: 'Miguel Bissuett',
      position: 'Ingeniero junior de desarrollo de aplicaciones',
      role: 'Developer',
      shift: '1st',
      mail: 'miguel.bissuett@fii-na.com',
      imageUrl: 'assets/developers/miguelbissuett.jpg'
    },
    {
      name: 'Martin Villanueva',
      position: 'Ingeniero junior de desarrollo de aplicaciones',
      role: 'Developer',
      shift: '1st',
      mail: 'martin.villanueva@fii-na.com',
      imageUrl: 'assets/developers/martinvillanueva.jpg'
    },
    {
      name: 'Angel Hernandez',
      position: 'Ingeniero junior de desarrollo de aplicaciones',
      role: 'Developer',
      shift: '1st',
      mail: 'angel.e.hernandez@FII-NA.com',
      imageUrl: 'assets/developers/angel.png'
    },
    {
      name: 'Elizabeth Jaramillo',
      position: 'Ingeniero junior de desarrollo de aplicaciones',
      role: 'Documenter',
      shift: '1st',
      mail: 'elizabeth.jaramillo@FII-NA.com',
      imageUrl: 'assets/developers/elizabeth.png'
    },
    {
      name: 'Hiram Rivera',
      position: 'Ingeniero junior de desarrollo de aplicaciones',
      role: 'Developer',
      shift: '1st',
      mail: 'hiram.rivera@fii-na.com',
      imageUrl: 'assets/developers/hiram_nefito.png'
    },
    // Second shift
    {
      name: 'Gabriel Gonzalez',
      position: 'Ingeniero junior de desarrollo de aplicaciones',
      role: 'Developer',
      shift: '2nd',
      mail: 'gabriel.gonzalez@fii-na.com',
      imageUrl: 'assets/developers/gabrielgonzalez.jpg'
    },
    {
      name: 'Javier Torres',
      position: 'Ingeniero junior de desarrollo de aplicaciones',
      role: 'Developer',
      shift: '2nd',
      mail: 'javiert.torres@fii-na.com',
      imageUrl: 'assets/developers/javiertorres.jpg'
    },
    {
      name: 'Luis Contreras',
      position: 'Ingeniero junior de desarrollo de aplicaciones',
      role: 'Developer',
      shift: '2nd',
      mail: 'luis.c.portillo@FII-NA.com',
      imageUrl: 'assets/developers/luis_contreras.png'
    },
    {
      name: 'Heriberto Chavez',
      position: 'Ingeniero junior de desarrollo de aplicaciones',
      role: 'Developer',
      shift: '3rd',
      mail: 'heriberto.marquez@FII-NA.com',
      imageUrl: 'assets/developers/heriberto.png'
    },
  ];

  public copyToClipboard(textToCopy: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.alert.info('', 'Text copied to clipboard');
      }).catch(err => {
        console.error('Error al copiar', err);
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.alert.info('', 'Text copied to clipboard');
    }
  }

}

interface Person {
  name: string;
  position: string;
  role: string;
  mail: string;
  shift: string;
  imageUrl: string;
}
