import jimp from "jimp";
import fs from "fs";
import path from "path";
import uuid4 from "uuid4";


export const getWorkdir = async () => {
    // Obtén la URL del directorio de trabajo
    const currentFileUrl = new URL('.', import.meta.url);
    let workdir = currentFileUrl.pathname;
    // Eliminar la barra diagonal inicial (si existe)
    workdir = workdir.replace(/^\/+/g, '');
    // Obtén la ruta absoluta al directorio de trabajo
    workdir = path.resolve(workdir);
    return workdir
}





export async function getNewId() {
    return uuid4()
}




export const convertToJpg = async (input_dir) => {
    const inputPath = input_dir
    const files = fs.readdirSync(inputPath);
    for (const file of files) {
        const extension = path.extname(file);
        console.log(extension);
        if (extension !== '.jpg') {
            const imagePath = path.join(inputPath, file);

            // Verificar si es un archivo de imagen válido
            if (fs.lstatSync(imagePath).isFile()) {
                const image = await jimp.read(imagePath);

                // Crear una nueva ruta con la extensión .jpg
                const newImagePath = path.join(inputPath, `${path.parse(file).name}.jpg`);

                // Guardar la imagen en formato JPG
                await image.writeAsync(newImagePath);

                // Eliminar el archivo de imagen original si deseas
                fs.unlinkSync(imagePath);
            }
        }

    }
};








export const renameFiles = async (input_dir, prefijo) => {
    // Obtén la lista de archivos en el directorio
    let directory = input_dir;
    let files = fs.readdirSync(directory);
    // Itera sobre cada archivo y cambia su nombre
    for (const x of files) {
        const id = await getNewId()
        const extension = path.extname(x);
        const oldPath = `${directory}${x}`;
        const newPath = `${directory}${id}${extension}`;
        console.log(newPath);
        fs.renameSync(oldPath, newPath);
    }
    directory = input_dir;
    files = fs.readdirSync(directory);
    files.forEach((x, i) => {
        const extension = path.extname(x);
        const oldPath = `${directory}${x}`;
        const newPath = `${directory}/${prefijo}${i + 1}${extension}`;
        fs.renameSync(oldPath, newPath);
    })
}






export async function resizeImages(input_dir, width, height) {
    const inputdir = input_dir; // Ruta de las imágenes
    // Lee el directorio y obtén la lista de archivos
    const files = fs.readdirSync(inputdir);

    for (const file of files) {
        if (file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg")) {
            // Crea la ruta completa del archivo
            const imagePath = `${inputdir}${file}`;
            console.log(imagePath);

            try {
                // Lee la imagen
                const image = await jimp.read(imagePath);

                // Aplica el procesamiento a la imagen
                await image.resize(width, height);

                // Guarda y sobrescribe la imagen
                await image.writeAsync(imagePath);

                console.log(`Imagen procesada: ${imagePath}`);
            } catch (error) {
                console.error(`Error al procesar la imagen: ${imagePath}`);
            }
        }
    }
    return
}




export async function resizeOneImage(input_dir, filename, width, height) {
    const imagePath = `${input_dir}${filename}`;
    try {
        const image = await jimp.read(imagePath);
        await image.resize(width, height);
        await image.writeAsync(imagePath);
        console.log(`Imagen procesada: ${imagePath}`);
    } catch (error) {
        console.error(`Error al procesar la imagen: ${imagePath}`);
    }
    return
}