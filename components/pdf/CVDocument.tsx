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
        padding: 40,
        fontSize: 11,
        fontFamily: "Helvetica",
        flexDirection: "row"
    },

    leftColumn: {
        width: "30%",
        paddingRight: 20
    },

    rightColumn: {
        width: "70%",
        paddingLeft: 20,
        borderLeftWidth: 1,
        borderLeftColor: "#e5e5e5"
    },

    name: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8
    },

    sectionTitle: {
        fontSize: 12,
        fontWeight: 600,
        marginTop: 18,
        marginBottom: 10,
        letterSpacing: 1,
        color: "#444"
    },

    jobTitle: {
        fontSize: 12,
        fontWeight: "bold"
    },

    company: {
        fontSize: 10,
        color: "#444",
        marginTop: 2
    },

    date: {
        fontSize: 9,
        color: "#888"
    },

    description: {
        fontSize: 10,
        marginTop: 6,
        lineHeight: 1.4
    },

    skill: {
        fontSize: 10,
        marginBottom: 5
    },

    textMuted: {
        fontSize: 10,
        color: "#666"
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    item: {
        marginBottom: 12
    },

    experienceBlock: {
        marginBottom: 14
    },

    educacionBlock: {
        marginBottom: 14
    }
})

interface Props {
    cv: CV
}

function formatDate(fecha: string) {
    if (!fecha) return ""
    const date = new Date(fecha)
    return date.toLocaleDateString("es-CL", {
        year: "numeric",
        month: "short"
    })
}

export default function CVDocument({ cv }: Props) {
    const experienciasOrdenadas = [...cv.experiencias].sort((a, b) =>
        new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    )

    const educacionOrdenada = [...cv.educacion].sort((a, b) =>
        new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    )

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* LEFT COLUMN */}
                <View style={styles.leftColumn}>

                    <Text style={styles.name}>{cv.nombre}</Text>

                    <Text style={styles.textMuted}>{cv.email}</Text>
                    <Text style={styles.textMuted}>{cv.telefono}</Text>
                    {cv.ubicacion ? <Text style={styles.textMuted}>{cv.ubicacion}</Text> : null}
                    {cv.linkedin ? <Link src={cv.linkedin} style={styles.textMuted}>{cv.linkedin}</Link> : null}

                    {cv.resumen && (
                        <>
                            <Text style={styles.sectionTitle}>PERFIL</Text>
                            <Text>{cv.resumen}</Text>
                        </>
                    )}

                    {cv.habilidades.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>HABILIDADES</Text>
                            {cv.habilidades.map((skill, index) => (
                                <Text key={index} style={styles.skill}>
                                    • {skill}
                                </Text>
                            ))}
                        </>
                    )}
                </View>

                {/* RIGHT COLUMN */}
                <View style={styles.rightColumn}>

                    {experienciasOrdenadas.length > 0 && (
                        <>
                            {/* Título protegido */}
                            <View wrap={false}>
                                <Text style={styles.sectionTitle}>EXPERIENCIA</Text>
                            </View>

                            {/* Contenido que sí puede fluir entre páginas */}
                            <View wrap>
                                {experienciasOrdenadas.map((exp, index) => (
                                    <View
                                        key={index}
                                        style={styles.experienceBlock}
                                        wrap={false} // ← cada experiencia no se parte
                                    >
                                        <View style={styles.rowBetween}>
                                            <Text style={styles.jobTitle}>
                                                {exp.cargo} - {exp.empresa}
                                            </Text>

                                            <Text style={styles.textMuted}>
                                                {formatDate(exp.fechaInicio)} -{" "}
                                                {exp.actual
                                                    ? "Actualidad"
                                                    : formatDate(exp.fechaFin)}
                                            </Text>
                                        </View>

                                        {exp.descripcion && (
                                            <Text style={styles.description}>
                                                {exp.descripcion}
                                            </Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </>
                    )}

                    {cv.educacion.length > 0 && (
                        <>
                            <View wrap={false}>
                                <Text style={styles.sectionTitle}>EDUCACIÓN</Text>
                            </View>

                            <View wrap>
                                {educacionOrdenada.map((edu, index) => (
                                    <View
                                        key={index}
                                        style={styles.educacionBlock}
                                        wrap={false}
                                    >
                                        <View style={styles.rowBetween}>
                                            <Text style={styles.jobTitle}>
                                                {edu.titulo} - {edu.institucion}
                                            </Text>
                                            <Text style={styles.textMuted}>
                                                {formatDate(edu.fechaInicio)} -{" "}
                                                {edu.actual ? "En curso" : formatDate(edu.fechaFin)}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </>
                    )}

                </View>

            </Page>
        </Document>
    )
}