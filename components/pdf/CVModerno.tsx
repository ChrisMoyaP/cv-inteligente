import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Link
} from "@react-pdf/renderer"
import { CV } from "@/types/cv"

const HEADER_COLOR = "#1e293b"
const ACCENT_COLOR = "#3b82f6"

const styles = StyleSheet.create({
    // ── Página — el padding aquí aplica a TODAS las páginas ──────
    page: {
        padding: 36,
        fontSize: 10,
        fontFamily: "Helvetica",
        backgroundColor: "#ffffff"
    },

    // ── Header ──────────────────────────────────────────────────
    header: {
        backgroundColor: HEADER_COLOR,
        padding: 20,
        paddingBottom: 16,
        marginBottom: 4
    },

    headerName: {
        fontSize: 22,
        fontFamily: "Helvetica-Bold",
        color: "#ffffff",
        marginBottom: 6
    },

    headerContact: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 4
    },

    headerContactItem: {
        fontSize: 9,
        color: "#cbd5e1"
    },

    headerLink: {
        fontSize: 9,
        color: "#93c5fd",
        textDecoration: "none"
    },

    // ── Sección ──────────────────────────────────────────────────
    sectionTitle: {
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
        color: ACCENT_COLOR,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        marginBottom: 5,
        marginTop: 12
    },

    divider: {
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        marginBottom: 8
    },

    // ── Resumen ──────────────────────────────────────────────────
    resumen: {
        fontSize: 10,
        lineHeight: 1.5,
        color: "#374151"
    },

    // ── Experiencia ──────────────────────────────────────────────
    expBlock: {
        marginBottom: 10
    },

    expHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 2
    },

    expCargo: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#1e293b"
    },

    expDate: {
        fontSize: 9,
        color: "#6b7280"
    },

    expEmpresa: {
        fontSize: 9,
        color: "#4b5563",
        marginBottom: 3
    },

    expDesc: {
        fontSize: 9,
        color: "#374151",
        lineHeight: 1.4
    },

    // ── Educación ────────────────────────────────────────────────
    eduBlock: {
        marginBottom: 8
    },

    eduHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 2
    },

    eduTitulo: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#1e293b"
    },

    eduDate: {
        fontSize: 9,
        color: "#6b7280"
    },

    eduInstitucion: {
        fontSize: 9,
        color: "#4b5563"
    },

    // ── Habilidades ──────────────────────────────────────────────
    skillsWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 5
    },

    skillPill: {
        fontSize: 9,
        backgroundColor: "#f1f5f9",
        color: "#1e293b",
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 3
    }
})

interface Props {
    cv: CV
}

function formatDate(fecha: string) {
    if (!fecha) return ""
    if (/^\d{4}$/.test(fecha)) return fecha
    const [year, month] = fecha.split("-").map(Number)
    const date = new Date(year, month - 1, 1)
    return date.toLocaleDateString("es-CL", { year: "numeric", month: "short" })
}

export default function CVModerno({ cv }: Props) {
    const experienciasOrdenadas = [...cv.experiencias].sort((a, b) =>
        new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    )

    const educacionOrdenada = [...cv.educacion].sort((a, b) =>
        new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    )

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.headerName}>{cv.nombre}</Text>

                    <View style={styles.headerContact}>
                        <Text style={styles.headerContactItem}>{cv.email}</Text>
                        <Text style={styles.headerContactItem}>{cv.telefono}</Text>
                        {cv.ubicacion ? (
                            <Text style={styles.headerContactItem}>{cv.ubicacion}</Text>
                        ) : null}
                        {cv.linkedin ? (
                            <Link src={cv.linkedin} style={styles.headerLink}>
                                {cv.linkedin}
                            </Link>
                        ) : null}
                    </View>
                </View>

                {/* Resumen */}
                {cv.resumen ? (
                    <>
                        <Text style={styles.sectionTitle}>Perfil</Text>
                        <View style={styles.divider} />
                        <Text style={styles.resumen}>{cv.resumen}</Text>
                    </>
                ) : null}

                {/* Experiencia */}
                {experienciasOrdenadas.length > 0 ? (
                    <>
                        <Text style={styles.sectionTitle}>Experiencia</Text>
                        <View style={styles.divider} />
                        {experienciasOrdenadas.map((exp, index) => (
                            <View key={index} style={styles.expBlock} wrap={false}>
                                <View style={styles.expHeader}>
                                    <Text style={styles.expCargo}>{exp.cargo}</Text>
                                    <Text style={styles.expDate}>
                                        {formatDate(exp.fechaInicio)} – {exp.actual ? "Actualidad" : formatDate(exp.fechaFin)}
                                    </Text>
                                </View>
                                <Text style={styles.expEmpresa}>{exp.empresa}</Text>
                                {exp.descripcion ? (
                                    <Text style={styles.expDesc}>{exp.descripcion}</Text>
                                ) : null}
                            </View>
                        ))}
                    </>
                ) : null}

                {/* Educación */}
                {educacionOrdenada.length > 0 ? (
                    <>
                        <Text style={styles.sectionTitle}>Educación</Text>
                        <View style={styles.divider} />
                        {educacionOrdenada.map((edu, index) => (
                            <View key={index} style={styles.eduBlock} wrap={false}>
                                <View style={styles.eduHeader}>
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
                        <Text style={styles.sectionTitle}>Habilidades</Text>
                        <View style={styles.divider} />
                        <View style={styles.skillsWrap}>
                            {cv.habilidades.map((skill, index) => (
                                <Text key={index} style={styles.skillPill}>{skill}</Text>
                            ))}
                        </View>
                    </>
                ) : null}

            </Page>
        </Document>
    )
}
