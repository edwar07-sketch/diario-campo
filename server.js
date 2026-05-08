const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, Table, TableRow, TableCell, AlignmentType, BorderStyle, WidthType, TextRun, PageBreak, HeadingLevel } = require('docx');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));

// Rutas
const DATA_FILE = path.join(__dirname, 'entries.json');

// Leer entradas
function readEntries() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error leyendo entradas:', err);
  }
  return [];
}

// Guardar entradas
function writeEntries(entries) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), 'utf8');
}

// Generar documento Word
async function generateWord(entries) {
  if (entries.length === 0) {
    entries = [];
  }

  const sorted = [...entries].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const sections = [
    new Paragraph({
      text: 'Diario de campo',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: 'Tesis doctoral — Edwar Lizama',
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: `Última actualización: ${new Date().toLocaleDateString('es-SV', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      italics: true,
    }),
    new Paragraph({
      text: `Total de entradas: ${entries.length}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      italics: true,
    }),
  ];

  sorted.forEach((entry, idx) => {
    const fecha = new Date(entry.fecha);
    const fechaFormato = fecha.toLocaleDateString('es-SV', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

    sections.push(
      new Paragraph({
        text: `Entrada ${idx + 1} — ${fecha.toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' })}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100, before: 200 },
      })
    );

    // Matriz como tabla
    sections.push(
      new Paragraph({
        text: 'Matriz',
        heading: HeadingLevel.HEADING_3,
        spacing: { after: 100 },
      })
    );

    const matrizData = [
      ['Campo', 'Valor'],
      ...[
        ['Fecha', fechaFormato],
        ['Lugar', entry.lugar || '—'],
        ['Perfil', entry.perfil === 'otro' && entry.perfilOtro ? entry.perfilOtro : (entry.perfil ? getPerfilLabel(entry.perfil) : '—')],
        ['Identificador', entry.identificador || '—'],
        ['Tipo de contacto', entry.tipoContacto || '—'],
        ['Duración', entry.duracion || '—'],
      ].filter(row => row[1] !== '—'),
    ];

    sections.push(
      new Table({
        rows: matrizData.map((row, idx) => {
          const isHeader = idx === 0;
          return new TableRow({
            cells: row.map(cell => new TableCell({
              children: [new Paragraph({
                text: cell,
                bold: isHeader,
              })],
              shading: isHeader ? { fill: 'D3D3D3' } : {},
              margins: { top: 50, bottom: 50, left: 50, right: 50 },
            })),
            height: { value: isHeader ? 300 : 'auto', rule: 'auto' },
          });
        }),
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
          left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
          right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
          insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
        },
      })
    );

    sections.push(new Paragraph({ text: '', spacing: { after: 100 } }));

    // Secciones de notas
    if (entry.descripcionDensa) {
      sections.push(
        new Paragraph({
          text: 'Descripción densa',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 50, before: 100 },
        }),
        new Paragraph({
          text: entry.descripcionDensa,
          spacing: { after: 100 },
          alignment: AlignmentType.JUSTIFIED,
        })
      );
    }

    if (entry.marcadoresLiterales) {
      sections.push(
        new Paragraph({
          text: 'Marcadores literales',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 50, before: 100 },
        }),
        new Paragraph({
          text: entry.marcadoresLiterales,
          spacing: { after: 100 },
          alignment: AlignmentType.JUSTIFIED,
          style: 'Quote',
        })
      );
    }

    if (entry.memoAnalitico) {
      sections.push(
        new Paragraph({
          text: 'Memo analítico',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 50, before: 100 },
        }),
        new Paragraph({
          text: entry.memoAnalitico,
          spacing: { after: 100 },
          alignment: AlignmentType.JUSTIFIED,
        })
      );
    }

    if (entry.conexionesTeoricas) {
      sections.push(
        new Paragraph({
          text: 'Conexiones teóricas',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 50, before: 100 },
        }),
        new Paragraph({
          text: entry.conexionesTeoricas,
          spacing: { after: 100 },
          alignment: AlignmentType.JUSTIFIED,
        })
      );
    }

    if (entry.reflexividad) {
      sections.push(
        new Paragraph({
          text: 'Reflexividad / posicionalidad',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 50, before: 100 },
        }),
        new Paragraph({
          text: entry.reflexividad,
          spacing: { after: 100 },
          alignment: AlignmentType.JUSTIFIED,
        })
      );
    }

    if (entry.preguntasEmergentes) {
      sections.push(
        new Paragraph({
          text: 'Preguntas emergentes / próximos pasos',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 50, before: 100 },
        }),
        new Paragraph({
          text: entry.preguntasEmergentes,
          spacing: { after: 100 },
          alignment: AlignmentType.JUSTIFIED,
        })
      );
    }

    // Separador entre entradas
    sections.push(new Paragraph({
      text: '',
      spacing: { after: 200 },
      border: {
        bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 },
      },
    }));
  });

  const doc = new Document({
    sections: [{ children: sections }],
  });

  return Packer.toBuffer(doc);
}

// Helpers
function generateId() {
  return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

const PERFILES = [
  { id: 'construccion', label: 'Construcción (con jerarquías internas de oficio)' },
  { id: 'mecanica_ambulante', label: 'Mecánica ambulante (espacios apropiados)' },
  { id: 'limpieza_domestica', label: 'Limpieza doméstica' },
  { id: 'venta_territorial', label: 'Venta ambulante con identidad territorial' },
  { id: 'canastas_mayor', label: 'Venta de canastas (adulta mayor)' },
  { id: 'jugos_dependientes', label: 'Venta de jugos con dependientes' },
  { id: 'parabrisas', label: 'Limpieza de parabrisas' },
  { id: 'comida_movil', label: 'Comida móvil con circuito definido' },
  { id: 'venta_desplazada', label: 'Venta desplazada con apropiación de acera' },
  { id: 'mercado_organizado', label: 'Mercado/tianguis con organización colectiva' },
  { id: 'comercio_digital', label: 'Comercio digital (Facebook) con punto de entrega' },
  { id: 'estudiante_autofinanc', label: 'Estudiante universitaria/o autofinanciándose' },
  { id: 'produccion_institucion', label: 'Producción informal en institución formal' },
  { id: 'catalogo_suplementario', label: 'Catálogo (ingreso suplementario)' },
  { id: 'catalogo_unico', label: 'Catálogo (único ingreso, ama de casa)' },
];

function getPerfilLabel(id) {
  const p = PERFILES.find(p => p.id === id);
  return p ? p.label : id;
}

// ============================================================================
// RUTAS API
// ============================================================================

// GET /api/entries — obtener todas las entradas
app.get('/api/entries', (req, res) => {
  const entries = readEntries();
  res.json(entries);
});

// POST /api/entries — crear nueva entrada
app.post('/api/entries', async (req, res) => {
  try {
    const entries = readEntries();
    const newEntry = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...req.body,
    };
    entries.push(newEntry);
    writeEntries(entries);
    console.log(`✓ Entrada guardada: ${newEntry.id}`);

    res.json(newEntry);
  } catch (err) {
    console.error('Error guardando entrada:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/entries/:id — actualizar entrada
app.put('/api/entries/:id', async (req, res) => {
  try {
    let entries = readEntries();
    const idx = entries.findIndex(e => e.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }
    entries[idx] = {
      ...entries[idx],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    writeEntries(entries);
    console.log(`✓ Entrada actualizada: ${req.params.id}`);

    res.json(entries[idx]);
  } catch (err) {
    console.error('Error actualizando entrada:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/entries/:id — eliminar entrada
app.delete('/api/entries/:id', async (req, res) => {
  try {
    let entries = readEntries();
    entries = entries.filter(e => e.id !== req.params.id);
    writeEntries(entries);
    console.log(`✓ Entrada eliminada: ${req.params.id}`);

    res.json({ success: true });
  } catch (err) {
    console.error('Error eliminando entrada:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/download — descargar Word con todas las entradas
app.get('/api/download', async (req, res) => {
  try {
    const entries = readEntries();
    const buffer = await generateWord(entries);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="Diario_Observaciones_${new Date().toISOString().split('T')[0]}.docx"`);
    res.send(buffer);
    
    console.log(`✓ Word descargado: ${entries.length} entradas`);
  } catch (err) {
    console.error('Error descargando Word:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║     DIARIO DE CAMPO — Servidor activo         ║');
  console.log('╠════════════════════════════════════════════════╣');
  console.log(`║ URL: http://localhost:${PORT}                  ║`);
  console.log('║ O desde otro dispositivo: http://[TU_IP]:3000 ║');
  console.log('╠════════════════════════════════════════════════╣');
  console.log('║ Descarga: Botón "Descargar Word" en la app    ║');
  console.log('║ Guarda en: Tu carpeta OneDrive manualmente     ║');
  console.log('╚════════════════════════════════════════════════╝\n');
});
