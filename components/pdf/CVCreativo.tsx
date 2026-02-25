import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Link
} from "@react-pdf/renderer"
import { CV } from "@/types/cv"

const SIDEBAR_BG = "#0f766e"   // teal-700
const SIDEBAR_ACCENT = "#2dd4bf" // teal-400
const SIDEBAR_TEXT = "#ccfbf1"   // teal-100
const SIDEBAR_MUTED = "#99f6e4"  // teal-200

const styles = StyleSheet.create({
    page: {
        fontSize: 10,
        fontFamily: "Helvetica",
        flexDirection: "row",
        backgroundColor: "#ffffff"
    },

    // ── Sidebar ──────────────────────────────────────────────────
    sidebar: {
        width: "33%",
        backgroundColor: SIDEBAR_BG,
        padding: 24,
        paddingTop: 30
    },

    sidebarName: {
        fontSize: 17,
        fontFamily: "Helvetica-Bold",
        color: "#ffffff",
        lineHeight: 1.2,
        marginBottom: 16
    },

    sidebarSectionTitle: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: SIDEBAR_ACCENT,
        letterSpacing: 1.2,
        marginTop: 14,
        marginBottom: 5
    },

    sidebarRule: {
        borderBottomWidth: 0.5,
        borderBottomColor: SIDEBAR_ACCENT,
        marginBottom: 7
    },

    sidebarText: {
        fontSize: 9,
        color: SIDEBAR_TEXT,
        lineHeight: 1.45
    },

    sidebarContactItem: {
        fontSize: 8,
        color: SIDEBAR_MUTED,
        marginBottom: 4
    },

    sidebarLink: {
        fontSize: 8,
        color: SIDEBAR_MUTED,
        textDecoration: "none",
        marginBottom: 4
    },

    skillPill: {
        fontSize: 8,
        color: SIDEBAR_TEXT,
        backgroundColor: "#0d9488",
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 3,
        marginBottom: 4,
        alignSelf: "flex-start"
    },

    // ── Main ─────────────────────────────────────────────────────
    main: {
        width: "67%",
        padding: 28,
        paddingLeft: 22
    },

    mainSectionTitle: {
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
        color: SIDEBAR_BG,
        letterSpacing: 1,
        marginTop: 14,
        marginBottom: 5
    },

    mainRule: {
        borderBottomWidth: 1,
        borderBottomColor: "#d1fae5",
        marginBottom: 9
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
        fontSize: 8,
        color: "#9ca3af"
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
        fontSize: 8,
        color: "#9ca3af"
    },

    eduInstitucion: {
        fontSize: 9,
        color: "#4b5563"
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

export default function CVCreativo({ cv }: Props) {
    const expOrdenadas = [...cv.experiencias].sort((a, b) =>
        new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    )
    const eduOrdenada = [...cv.educacion].sort((a, b) =>
        new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    )

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* SIDEBAR */}
                <View style={styles.sidebar}>
                    <Text style={styles.sidebarName}>{cv.nombre}</Text>

                    <Text style={[styles.sidebarSectionTitle, { marginTop: 0 }]}>CONTACTO</Text>
                    <View style={styles.sidebarRule} />
                    <Text style={styles.sidebarContactItem}>{cv.email}</Text>
                    <Text style={styles.sidebarContactItem}>{cv.telefono}</Text>
                    {cv.ubicacion ? (
                        <Text style={styles.sidebarContactItem}>{cv.ubicacion}</Text>
                    ) : null}
                    {cv.linkedin ? (
                        <Link src={cv.linkedin} style={styles.sidebarLink}>{cv.linkedin}</Link>
                    ) : null}

                    {cv.resumen ? (
                        <>
                            <Text style={styles.sidebarSectionTitle}>PERFIL</Text>
                            <View style={styles.sidebarRule} />
                            <Text style={styles.sidebarText}>{cv.resumen}</Text>
                        </>
                    ) : null}

                    {cv.habilidades.length > 0 ? (
                        <>
                            <Text style={styles.sidebarSectionTitle}>HABILIDADES</Text>
                            <View style={styles.sidebarRule} />
                            {cv.habilidades.map((skill, i) => (
                                <Text key={i} style={styles.skillPill}>{skill}</Text>
                            ))}
                        </>
                    ) : null}
                </View>

                {/* MAIN */}
                <View style={styles.main}>
                    {expOrdenadas.length > 0 ? (
                        <>
                            <Text style={[styles.mainSectionTitle, { marginTop: 30 }]}>EXPERIENCIA</Text>
                            <View style={styles.mainRule} />
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

                    {eduOrdenada.length > 0 ? (
                        <>
                            <Text style={styles.mainSectionTitle}>EDUCACIÓN</Text>
                            <View style={styles.mainRule} />
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
                </View>

            </Page>
        </Document>
    )
}
