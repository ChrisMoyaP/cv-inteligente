import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Link
} from "@react-pdf/renderer"
import { CV } from "@/types/cv"

const ACCENT = "#dc2626" // red-600

const styles = StyleSheet.create({
    page: {
        padding: 32,
        fontSize: 10,
        fontFamily: "Helvetica",
        backgroundColor: "#ffffff"
    },

    // ── Header: nombre izq, contacto der ────────────────────────
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingBottom: 8,
        marginBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: ACCENT
    },

    name: {
        fontSize: 22,
        fontFamily: "Helvetica-Bold",
        color: "#111827"
    },

    contactCol: {
        flexDirection: "column",
        alignItems: "flex-end"
    },

    contactItem: {
        fontSize: 8,
        color: "#6b7280",
        marginBottom: 2
    },

    contactLink: {
        fontSize: 8,
        color: "#6b7280",
        textDecoration: "none",
        marginBottom: 2
    },

    // ── Sección con borde izquierdo ──────────────────────────────
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 11,
        marginBottom: 7
    },

    sectionAccent: {
        width: 3,
        height: 13,
        backgroundColor: ACCENT,
        borderRadius: 1,
        marginRight: 7
    },

    sectionTitle: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#111827",
        letterSpacing: 0.5
    },

    // ── Contenido ────────────────────────────────────────────────
    resumen: {
        fontSize: 9,
        lineHeight: 1.45,
        color: "#374151"
    },

    expBlock: { marginBottom: 8 },

    expRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 1
    },

    expTitle: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#111827"
    },

    expDate: {
        fontSize: 8,
        color: "#9ca3af"
    },

    expDesc: {
        fontSize: 9,
        color: "#374151",
        lineHeight: 1.35
    },

    eduBlock: { marginBottom: 7 },

    eduRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 1
    },

    eduTitulo: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#111827"
    },

    eduDate: {
        fontSize: 8,
        color: "#9ca3af"
    },

    eduInstitucion: {
        fontSize: 9,
        color: "#4b5563"
    },

    skillsText: {
        fontSize: 9,
        color: "#374151",
        lineHeight: 1.5
    }
})

interface Props {
    cv: CV
}

function formatDate(fecha: string) {
    if (!fecha) return ""
    const date = new Date(fecha)
    return date.toLocaleDateString("es-CL", { year: "numeric", month: "short" })
}

function SectionHeader({ title }: { title: string }) {
    return (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    )
}

export default function CVCompacto({ cv }: Props) {
    const expOrdenadas = [...cv.experiencias].sort((a, b) =>
        new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    )
    const eduOrdenada = [...cv.educacion].sort((a, b) =>
        new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    )

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{cv.nombre}</Text>
                    <View style={styles.contactCol}>
                        <Text style={styles.contactItem}>{cv.email}</Text>
                        <Text style={styles.contactItem}>{cv.telefono}</Text>
                        {cv.ubicacion ? (
                            <Text style={styles.contactItem}>{cv.ubicacion}</Text>
                        ) : null}
                        {cv.linkedin ? (
                            <Link src={cv.linkedin} style={styles.contactLink}>{cv.linkedin}</Link>
                        ) : null}
                    </View>
                </View>

                {/* Resumen */}
                {cv.resumen ? (
                    <>
                        <SectionHeader title="PERFIL PROFESIONAL" />
                        <Text style={styles.resumen}>{cv.resumen}</Text>
                    </>
                ) : null}

                {/* Experiencia */}
                {expOrdenadas.length > 0 ? (
                    <>
                        <SectionHeader title="EXPERIENCIA LABORAL" />
                        {expOrdenadas.map((exp, i) => (
                            <View key={i} style={styles.expBlock} wrap={false}>
                                <View style={styles.expRow}>
                                    <Text style={styles.expTitle}>{exp.cargo} — {exp.empresa}</Text>
                                    <Text style={styles.expDate}>
                                        {formatDate(exp.fechaInicio)} – {exp.actual ? "Actualidad" : formatDate(exp.fechaFin)}
                                    </Text>
                                </View>
                                {exp.descripcion ? (
                                    <Text style={styles.expDesc}>{exp.descripcion}</Text>
                                ) : null}
                            </View>
                        ))}
                    </>
                ) : null}

                {/* Educación */}
                {eduOrdenada.length > 0 ? (
                    <>
                        <SectionHeader title="EDUCACIÓN" />
                        {eduOrdenada.map((edu, i) => (
                            <View key={i} style={styles.eduBlock} wrap={false}>
                                <View style={styles.eduRow}>
                                    <Text style={styles.eduTitulo}>{edu.titulo}</Text>
                                    <Text style={styles.eduDate}>
                                        {formatDate(edu.fechaInicio)} – {edu.actual ? "En curso" : formatDate(edu.fechaFin)}
                                    </Text>
                                </View>
                                <Text style={styles.eduInstitucion}>{edu.institucion}</Text>
                            </View>
                        ))}
                    </>
                ) : null}

                {/* Habilidades */}
                {cv.habilidades.length > 0 ? (
                    <>
                        <SectionHeader title="HABILIDADES" />
                        <Text style={styles.skillsText}>
                            {cv.habilidades.join("   ·   ")}
                        </Text>
                    </>
                ) : null}

            </Page>
        </Document>
    )
}
