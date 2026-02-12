import Field from './field.model.js';

export const createField = async (req, res) => {
    try {
        
        const fieldData = req.body;

        if (req.file) {
            fieldData.photo = req.file.path;
        }

        /*if (req.file) {
            const extension = req.file.path.split('.').pop();
            const filename = req.file.filename;
            const relativePath = filename.substring(filename.indexOf('fields/'));

            fieldData.photo = '${relativePath}.${extension}';
        } else {
            fieldData.photo = 'fields/kinal_sports_nyvxo5';
        }*/

        const field = new Field(fieldData);
        await field.save();

        res.status(201).json({
            success: true,
            message: 'Campo creado exitosamente',
            data: field
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear el campo',
            error: error.message
        })
    }
}