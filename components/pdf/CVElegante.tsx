import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Link
} from "@react-pdf/renderer"
import { CV } from "@/types/cv"

const styles = StyleSheet.create({
    page: {
        padding: 44,
        fontSize: 10,
        fontFamily: "Helvetica",
        backgroundColor: "#ffffff"
    },

    // ── Header centrado ──────────────────────────────────────────
    name: {
        fontSize: 24,
        fontFamily: "Helvetica-Bold",
        letterSpacing: 2,
        color: "#111827",
        textAlign: "center",
        marginBottom: 10
    },

    nameRule: {
        borderBottomWidth: 1,
        borderBottomColor: "#374151",
        marginBottom: 10
    },

    contactRow: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: 4
    },

    contactItem: {
        fontSize: 9,
        color: "#6b7280"
    },

    contactSep: {
        fontSize: 9,
        color: "#d1d5db",
        marginHorizontal: 6
    },

    contactLink: {
        fontSize: 9,
        color: "#6b7280",
        textDecoration: "none"
    },

    // ── Separador "── TÍTULO ──" ─────────────────────────────────
    sectionWrap: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 16,
        marginBottom: 10
    },

    sectionLine: {
        flex: 1,
        borderBottomWidth: 0.5,
        borderBottomColor: "#9ca3af"
    },

    sectionTitle: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        letterSpacing: 2,
        color: "#6b7280",
        marginHorizontal: 10
    },

    // ── Contenido ────────────────────────────────────────────────
    resumen: {
        fontSize: 10,
        lineHeight: 1.5,
        color: "#374151",
        textAlign: "center"
    },

    expBlock: { marginBottom: 10 },

    expHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 2
    },

    expCargo: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#111827"
    },

    expDate: {
        fontSize: 9,
        color: "#9ca3af"
    },

    expEmpresa: {
        fontSize: 9,
        color: "#6b7280",
        fontFamily: "Helvetica-Oblique",
        marginBottom: 3
    },

    expDesc: {
        fontSize: 9,
        color: "#374151",
        lineHeight: 1.4
    },

    eduBlock: { marginBottom: 8 },

    eduHeader: {
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
        fontSize: 9,
        color: "#9ca3af"
    },

    eduInstitucion: {
        fontSize: 9,
        color: "#6b7280",
        fontFamily: "Helvetica-Oblique"
    },

    skillsText: {
        fontSize: 9,
        color: "#6b7280",
        textAlign: "center",
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

function SectionDivider({ title }: { title: string }) {
    return (
        <View style={styles.sectionWrap}>
            <View style={styles.sectionLine} />
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionLine} />
        </View>
    )
}

export default function CVElegante({ cv }: Props) {
    const expOrdenadas = [...cv.experiencias].sort((a, b) =>
        new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    )
    const eduOrdenada = [...cv.educacion].sort((a, b) =>
        new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    )

    const contactItems: string[] = [cv.email, cv.telefono]
    if (cv.ubicacion) contactItems.push(cv.ubicacion)

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <Text style={styles.name}>{cv.nombre}</Text>
                <View style={styles.nameRule} />

                <View style={styles.contactRow}>
                    {contactItems.map((item, i) => (
                        <View key={i} style={{ flexDirection: "row" }}>
                            {i > 0 && <Text style={styles.contactSep}>·</Text>}
                            <Text style={styles.contactItem}>{item}</Text>
                        </View>
                    ))}
                    {cv.linkedin ? (
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.contactSep}>·</Text>
                            <Link src={cv.linkedin} style={styles.contactLink}>{cv.linkedin}</Link>
                        </View>
                    ) : null}
                </View>

                {/* Resumen */}
                {cv.resumen ? (
                    <>
                        <SectionDivider title="PERFIL" />
                        <Text style={styles.resumen}>{cv.resumen}</Text>
                    </>
                ) : null}

                {/* Experiencia */}
                {expOrdenadas.length > 0 ? (
                    <>
                        <SectionDivider title="EXPERIENCIA" />
                        {expOrdenadas.map((exp, i) => (
                            <View key={i} style={styles.expBlock} wrap={false}>
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
                {eduOrdenada.length > 0 ? (
                    <>
                        <SectionDivider title="EDUCACIÓN" />
                        {eduOrdenada.map((edu, i) => (
                            <View key={i} style={styles.eduBlock} wrap={false}>
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
                        <SectionDivider title="HABILIDADES" />
                        <Text style={styles.skillsText}>
                            {cv.habilidades.join("   ·   ")}
                        </Text>
                    </>
                ) : null}

            </Page>
        </Document>
    )
}
