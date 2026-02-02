/*La función downloadBlobFile permite descargar un archivo en el navegador a partir de un objeto Blob. 
Es útil cuando se generan archivos dinámicamente en el frontend (por ejemplo, reportes, imágenes, PDFs, etc.)
y se desea ofrecer al usuario la opción de descargarlos.*/

export function downloadBlobFile ( blob: Blob, fileName: string ): void {

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click( );
    link.remove( ); 

}
  