export interface CampoFormulario {
    control: string;                                // Nombre del FormControl
    label: string;                                  // Etiqueta visible
    tipo: 'text' | 'number' | 'select' | 'checkbox'; // Tipo de campo
    opciones?: { value: any; label: string }[];     // Solo para select
    placeholder?: string;                           // Opcional
    requerido?: boolean;                            // Opcional
  }
  