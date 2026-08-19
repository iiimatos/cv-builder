import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"

import type { CVData } from "@/types/cv"

interface ClassicPDFDocumentProps {
  data: CVData
  photoPath?: string
}

const pageWidth = 595.28
const pageHeight = 841.89

Font.registerHyphenationCallback((word) => [word.replace(/\u00ad/g, "")])

const WORD_JOINER = "\u2060"

const styles = StyleSheet.create({
  page: {
    width: pageWidth,
    minHeight: pageHeight,
    paddingHorizontal: 40,
    paddingVertical: 32,
    backgroundColor: "#ffffff",
    color: "#18181b",
    fontFamily: "Helvetica",
  },
  header: {
    borderBottomWidth: 1.25,
    borderBottomColor: "#18181b",
    paddingBottom: 16,
  },
  headerGrid: {
    flexDirection: "row",
    gap: 20,
  },
  headerContent: {
    flex: 1,
  },
  eyebrow: {
    color: "#71717a",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  name: {
    marginTop: 8,
    fontSize: 34,
    fontWeight: 700,
    lineHeight: 1,
  },
  title: {
    marginTop: 8,
    color: "#3f3f46",
    fontSize: 12,
    fontWeight: 700,
  },
  contactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 18,
  },
  contactItem: {
    width: "48%",
    color: "#52525b",
    fontSize: 8.5,
    lineHeight: 1.35,
  },
  contactLabel: {
    color: "#27272a",
    fontWeight: 700,
  },
  photo: {
    width: 96,
    height: 120,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    objectFit: "cover",
  },
  photoPlaceholder: {
    width: 96,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    color: "#a1a1aa",
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  main: {
    flexDirection: "row",
    gap: 24,
    paddingTop: 20,
  },
  leftColumn: {
    flex: 1,
    gap: 15,
  },
  rightColumn: {
    width: 192,
    gap: 15,
    borderLeftWidth: 1,
    borderLeftColor: "#e4e4e7",
    paddingLeft: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 8.5,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  sectionRule: {
    flex: 1,
    height: 1,
    backgroundColor: "#e4e4e7",
  },
  bodyText: {
    color: "#3f3f46",
    fontSize: 9.5,
    lineHeight: 1.45,
  },
  smallText: {
    color: "#3f3f46",
    fontSize: 8.5,
    lineHeight: 1.35,
  },
  mutedText: {
    color: "#71717a",
    fontSize: 8,
    lineHeight: 1.35,
  },
  itemGroup: {
    gap: 8,
  },
  item: {
    gap: 7,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },
  itemNoBorder: {
    gap: 7,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },
  itemTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    lineHeight: 1.25,
  },
  itemSubtitle: {
    color: "#3f3f46",
    fontSize: 9,
    fontWeight: 700,
    lineHeight: 1.35,
  },
  date: {
    color: "#71717a",
    fontSize: 8,
    fontWeight: 700,
    lineHeight: 1.35,
    textAlign: "right",
  },
  bulletRow: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 3,
  },
  bulletDot: {
    width: 5,
    color: "#3f3f46",
    fontSize: 9,
    lineHeight: 1.35,
  },
  bulletText: {
    flex: 1,
    color: "#3f3f46",
    fontSize: 9.5,
    lineHeight: 1.35,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#fafafa",
    paddingHorizontal: 6,
    paddingVertical: 3,
    color: "#3f3f46",
    fontSize: 7.5,
    fontWeight: 700,
  },
  sideItem: {
    marginBottom: 10,
  },
  languageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 5,
  },
  bold: {
    color: "#18181b",
    fontWeight: 700,
  },
  italic: {
    fontStyle: "italic",
  },
})

type TextStyle = typeof styles.bodyText

function dateRange(startDate?: string, endDate?: string, current?: boolean) {
  return [startDate, current ? "Actualidad" : endDate].filter(Boolean).join(" - ")
}

function cleanMarkdown(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[_*~#>`]/g, "")
}

function MarkdownText({
  children,
  style,
}: {
  children: string
  style?: TextStyle | TextStyle[]
}) {
  const parts = children.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean)

  return (
    <Text style={style}>
      {parts.map((part, index) => {
        const nextPart = parts[index + 1]
        const leadingPunctuation = nextPart?.match(/^([,.;:!?])(\s*)/)
        const suffix = leadingPunctuation?.[1] ?? ""

        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Text key={`${part}-${index}`} style={styles.bold}>
              {cleanMarkdown(part.slice(2, -2))}
              {suffix ? `${WORD_JOINER}${suffix}` : ""}
            </Text>
          )
        }

        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <Text key={`${part}-${index}`} style={styles.italic}>
              {cleanMarkdown(part.slice(1, -1))}
              {suffix ? `${WORD_JOINER}${suffix}` : ""}
            </Text>
          )
        }

        if (part.match(/^[,.;:!?]\s*/) && parts[index - 1]?.match(/^\*[^*]+\*$|^\*\*[^*]+\*\*$/)) {
          return part.replace(/^[,.;:!?]/, "")
        }

        return cleanMarkdown(part)
      })}
    </Text>
  )
}

function Section({
  title,
  children,
  dense = false,
}: {
  title: string
  children: React.ReactNode
  dense?: boolean
}) {
  return (
    <View>
      <View style={dense ? { ...styles.sectionHeader, marginBottom: 5 } : styles.sectionHeader}>
        <Text style={dense ? { ...styles.sectionTitle, fontSize: 8 } : styles.sectionTitle}>
          {title}
        </Text>
        <View style={styles.sectionRule} />
      </View>
      {children}
    </View>
  )
}

function InlineTagList({ items, style }: { items: string[]; style?: TextStyle | TextStyle[] }) {
  const filtered = items.filter(Boolean)
  if (filtered.length === 0) return null

  return (
    <Text style={style ?? styles.smallText}>
      {filtered.join(" | ")}
    </Text>
  )
}

function Specializations({
  items,
  textStyle,
}: {
  items: string[]
  textStyle?: TextStyle | TextStyle[]
}) {
  const filtered = items.filter(Boolean)
  if (filtered.length === 0) return null

  return (
    <View>
      {filtered.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={textStyle ?? styles.smallText}>{item}</Text>
        </View>
      ))}
    </View>
  )
}

function Bullets({
  items,
  textStyle,
}: {
  items: string[]
  textStyle?: TextStyle | TextStyle[]
}) {
  const bullets = items.filter(Boolean)
  if (bullets.length === 0) return null

  return (
    <View>
      {bullets.map((bullet) => (
        <View key={bullet} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <MarkdownText style={textStyle ?? styles.bulletText}>{bullet}</MarkdownText>
        </View>
      ))}
    </View>
  )
}

function contacts(data: CVData) {
  return [
    data.settings.showLocation && data.personal.location
      ? { label: "Ubicación", value: data.personal.location }
      : null,
    data.personal.email ? { label: "Correo", value: data.personal.email } : null,
    data.personal.phone ? { label: "Teléfono", value: data.personal.phone } : null,
    ...(data.settings.showLinks
      ? data.personal.links
        .filter((link) => link.label.trim() && link.url.trim())
        .map((link) => ({ label: link.label, value: link.url }))
      : []),
  ].filter((item): item is { label: string; value: string } => Boolean(item))
}

function AtsPDFPage({ data }: { data: CVData }) {
  const contactLine = contacts(data).map((item) => item.value).join(" | ")
  const dense = data.settings.spacing === "compact" || data.settings.fontSize === "compact"
  const bodyText = dense
    ? { ...styles.bodyText, fontSize: 8.4, lineHeight: 1.28 }
    : styles.bodyText
  const smallText = dense
    ? { ...styles.smallText, fontSize: 8, lineHeight: 1.25 }
    : styles.smallText
  const itemTitle = dense
    ? { ...styles.itemTitle, fontSize: 9.4, lineHeight: 1.2 }
    : styles.itemTitle
  const itemSubtitle = dense
    ? { ...styles.itemSubtitle, fontSize: 8.2, lineHeight: 1.25 }
    : styles.itemSubtitle

  return (
    <Page
      size="A4"
      style={{
        ...styles.page,
        paddingHorizontal: dense ? 34 : 44,
        paddingVertical: dense ? 28 : 36,
      }}
    >
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "#a1a1aa",
          paddingBottom: dense ? 9 : 12,
        }}
      >
        <Text style={{ fontSize: dense ? 22 : 24, fontWeight: 700, lineHeight: 1.1 }}>
          {data.personal.firstName} {data.personal.lastName}
        </Text>
        <Text
          style={{
            marginTop: dense ? 3 : 4,
            color: "#27272a",
            fontSize: dense ? 10 : 11,
            fontWeight: 700,
          }}
        >
          {data.personal.professionalTitle}
        </Text>
        <Text
          style={{
            marginTop: dense ? 5 : 7,
            color: "#3f3f46",
            fontSize: dense ? 7.6 : 8.5,
            lineHeight: 1.3,
          }}
        >
          {contactLine}
        </Text>
      </View>

      <View style={{ gap: dense ? 9 : 13, paddingTop: dense ? 12 : 16 }}>
        {data.summary.trim() ? (
          <Section title="Resumen profesional" dense={dense}>
            <MarkdownText style={bodyText}>{data.summary}</MarkdownText>
          </Section>
        ) : null}

        <Section title="Experiencia" dense={dense}>
          <View style={dense ? { ...styles.itemGroup, gap: 6 } : styles.itemGroup}>
            {data.experience.map((item) => (
              <View key={item.id} style={{ gap: dense ? 3 : 4 }}>
                <Text style={itemTitle}>{item.position}</Text>
                <Text style={itemSubtitle}>
                  {item.company}
                  {item.location ? ` | ${item.location}` : ""}
                  {dateRange(item.startDate, item.endDate, item.current)
                    ? ` | ${dateRange(item.startDate, item.endDate, item.current)}`
                    : ""}
                </Text>
                {item.description ? <MarkdownText style={bodyText}>{item.description}</MarkdownText> : null}
                <Bullets items={item.bullets} textStyle={bodyText} />
                {item.technologies.length > 0 ? (
                  <Text style={smallText}>
                    <Text style={styles.bold}>Tecnologías: </Text>
                    {item.technologies.join(", ")}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        </Section>

        <Section title="Educación" dense={dense}>
          {data.education.map((item) => (
            <View key={item.id} style={dense ? { ...styles.sideItem, marginBottom: 6 } : styles.sideItem}>
              <Text style={itemTitle}>{item.degree}</Text>
              <Text style={smallText}>
                {item.institution}
                {dateRange(item.startDate, item.endDate)
                  ? ` | ${dateRange(item.startDate, item.endDate)}`
                  : ""}
              </Text>
            </View>
          ))}
        </Section>

        <Section title="Habilidades" dense={dense}>
          {data.skills.map((category) => (
            <Text key={category.id} style={smallText}>
              <Text style={styles.bold}>{category.name}: </Text>
              {category.skills.join(", ")}
            </Text>
          ))}
        </Section>

        {(data.languages.length > 0 ||
          (data.settings.showSpecializations && data.specializations.length > 0)) ? (
          <View style={{ gap: dense ? 9 : 13 }}>
            {data.languages.length > 0 ? (
              <Section title="Idiomas" dense={dense}>
                <Text style={smallText}>
                  {data.languages.map((item) => `${item.language}: ${item.level}`).join(" | ")}
                </Text>
              </Section>
            ) : null}

            {data.settings.showSpecializations && data.specializations.length > 0 ? (
              <Section title="Áreas de especialización" dense={dense}>
                <Specializations items={data.specializations} textStyle={smallText} />
              </Section>
            ) : null}
          </View>
        ) : null}
      </View>
    </Page>
  )
}

function MultiPageAtsPDFDocument({ data }: { data: CVData }) {
  const [firstExperience, ...remainingExperience] = data.experience
  const firstPageData = {
    ...data,
    experience: firstExperience ? [firstExperience] : [],
    education: [],
    skills: [],
    languages: [],
    specializations: [],
    projects: [],
  }
  const secondPageData = {
    ...data,
    summary: "",
    experience: remainingExperience,
  }

  return (
    <Document
      title={`${data.personal.firstName} ${data.personal.lastName} CV`}
      author={`${data.personal.firstName} ${data.personal.lastName}`}
    >
      <AtsPDFPage data={firstPageData} />
      <AtsPDFPage data={secondPageData} />
    </Document>
  )
}

function MultiPagePDFDocument({ data, photoPath }: ClassicPDFDocumentProps) {
  return (
    <Document
      title={`${data.personal.firstName} ${data.personal.lastName} CV`}
      author={`${data.personal.firstName} ${data.personal.lastName}`}
    >
      <Page
        size="A4"
        style={{
          ...styles.page,
          paddingHorizontal: 42,
          paddingVertical: 36,
        }}
        wrap
      >
        <View style={styles.header} wrap={false}>
          <View style={styles.headerGrid}>
            <View style={styles.headerContent}>
              <Text style={styles.eyebrow}>Currículum profesional</Text>
              <Text style={styles.name}>
                {data.personal.firstName} {data.personal.lastName}
              </Text>
              <Text style={styles.title}>{data.personal.professionalTitle}</Text>

              <View style={styles.contactGrid}>
                {contacts(data).map((item) => (
                  <Text key={`${item.label}-${item.value}`} style={styles.contactItem}>
                    <Text style={styles.contactLabel}>{item.label}: </Text>
                    {item.value}
                  </Text>
                ))}
              </View>
            </View>

            {data.settings.showPhoto && photoPath ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={photoPath} style={styles.photo} />
            ) : null}
          </View>
        </View>

        <View style={{ gap: 16, paddingTop: 20 }}>
          {data.summary.trim() ? (
            <Section title="Resumen profesional">
              <MarkdownText style={styles.bodyText}>{data.summary}</MarkdownText>
            </Section>
          ) : null}

          <Section title="Experiencia">
            <View style={styles.itemGroup}>
              {data.experience.map((item, index) => (
                <View
                  key={item.id}
                  style={index === data.experience.length - 1 ? styles.itemNoBorder : styles.item}
                >
                  <View style={styles.itemHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{item.position}</Text>
                      <Text style={styles.itemSubtitle}>{item.company}</Text>
                      {item.location ? <Text style={styles.mutedText}>{item.location}</Text> : null}
                    </View>
                    <Text style={styles.date}>
                      {dateRange(item.startDate, item.endDate, item.current)}
                    </Text>
                  </View>

                  {item.description ? (
                    <MarkdownText style={styles.bodyText}>{item.description}</MarkdownText>
                  ) : null}

                  <Bullets items={item.bullets} />
                  <InlineTagList items={item.technologies} />
                </View>
              ))}
            </View>
          </Section>

          {data.settings.showProjects && data.projects.length > 0 ? (
            <Section title="Proyectos">
              <View style={styles.itemGroup}>
                {data.projects.map((project, index) => (
                  <View
                    key={project.id}
                    style={index === data.projects.length - 1 ? styles.itemNoBorder : styles.item}
                  >
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{project.name}</Text>
                      {project.url ? <Text style={styles.date}>{project.url}</Text> : null}
                    </View>
                    {project.description ? (
                      <MarkdownText style={styles.bodyText}>{project.description}</MarkdownText>
                    ) : null}
                    <Bullets items={project.bullets} />
                    <InlineTagList items={project.technologies} />
                  </View>
                ))}
              </View>
            </Section>
          ) : null}

          {data.education.length > 0 ? (
            <Section title="Educación">
              <View style={styles.itemGroup}>
                {data.education.map((item) => (
                  <View key={item.id} style={styles.itemNoBorder}>
                    <Text style={styles.itemTitle}>{item.degree}</Text>
                    <Text style={styles.smallText}>{item.institution}</Text>
                    <Text style={styles.mutedText}>{dateRange(item.startDate, item.endDate)}</Text>
                    {item.description ? (
                      <MarkdownText style={styles.smallText}>{item.description}</MarkdownText>
                    ) : null}
                  </View>
                ))}
              </View>
            </Section>
          ) : null}

          {data.skills.length > 0 ? (
            <Section title="Habilidades">
              <View style={styles.itemGroup}>
                {data.skills.map((category) => (
                  <View key={category.id} style={styles.itemNoBorder}>
                    <Text style={styles.itemSubtitle}>{category.name}</Text>
                    <InlineTagList items={category.skills} />
                  </View>
                ))}
              </View>
            </Section>
          ) : null}

          {data.languages.length > 0 ? (
            <Section title="Idiomas">
              {data.languages.map((item) => (
                <View key={item.id} style={styles.languageRow}>
                  <Text style={styles.itemSubtitle}>{item.language}</Text>
                  <Text style={styles.smallText}>{item.level}</Text>
                </View>
              ))}
            </Section>
          ) : null}

          {data.settings.showSpecializations && data.specializations.length > 0 ? (
            <Section title="Áreas de especialización">
              <Specializations items={data.specializations} />
            </Section>
          ) : null}
        </View>
      </Page>
    </Document>
  )
}

export function ClassicPDFDocument({ data, photoPath }: ClassicPDFDocumentProps) {
  if (data.settings.pageMode === "multi" && data.settings.template === "classic") {
    return <MultiPagePDFDocument data={data} photoPath={photoPath} />
  }

  if (data.settings.template === "ats") {
    if (data.settings.pageMode === "multi") {
      return <MultiPageAtsPDFDocument data={data} />
    }

    return (
      <Document
        title={`${data.personal.firstName} ${data.personal.lastName} CV`}
        author={`${data.personal.firstName} ${data.personal.lastName}`}
      >
        <AtsPDFPage data={data} />
      </Document>
    )
  }

  return (
    <Document
      title={`${data.personal.firstName} ${data.personal.lastName} CV`}
      author={`${data.personal.firstName} ${data.personal.lastName}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerGrid}>
            <View style={styles.headerContent}>
              <Text style={styles.eyebrow}>Currículum profesional</Text>
              <Text style={styles.name}>
                {data.personal.firstName} {data.personal.lastName}
              </Text>
              <Text style={styles.title}>{data.personal.professionalTitle}</Text>

              <View style={styles.contactGrid}>
                {contacts(data).map((item) => (
                  <Text key={`${item.label}-${item.value}`} style={styles.contactItem}>
                    <Text style={styles.contactLabel}>{item.label}: </Text>
                    {item.value}
                  </Text>
                ))}
              </View>
            </View>

            {data.settings.showPhoto ? (
              photoPath ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image src={photoPath} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text>Foto</Text>
                </View>
              )
            ) : null}
          </View>
        </View>

        <View style={styles.main}>
          <View style={styles.leftColumn}>
            {data.summary.trim() ? (
              <Section title="Resumen profesional">
                <MarkdownText style={styles.bodyText}>{data.summary}</MarkdownText>
              </Section>
            ) : null}

            {data.settings.showProjects && data.projects.length > 0 ? (
              <Section title="Proyectos">
                <View style={styles.itemGroup}>
                  {data.projects.map((project) => (
                    <View key={project.id} style={styles.itemNoBorder}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{project.name}</Text>
                        {project.url ? <Text style={styles.date}>{project.url}</Text> : null}
                      </View>
                      {project.description ? (
                        <MarkdownText style={styles.bodyText}>{project.description}</MarkdownText>
                      ) : null}
                      <Bullets items={project.bullets} />
                      <InlineTagList items={project.technologies} />
                    </View>
                  ))}
                </View>
              </Section>
            ) : null}

            <Section title="Experiencia">
              <View style={styles.itemGroup}>
                {data.experience.map((item, index) => (
                  <View
                    key={item.id}
                    style={index === data.experience.length - 1 ? styles.itemNoBorder : styles.item}
                  >
                    <View style={styles.itemHeader}>
                      <View>
                        <Text style={styles.itemTitle}>{item.position}</Text>
                        <Text style={styles.itemSubtitle}>{item.company}</Text>
                        {item.location ? <Text style={styles.mutedText}>{item.location}</Text> : null}
                      </View>
                      <Text style={styles.date}>
                        {dateRange(item.startDate, item.endDate, item.current)}
                      </Text>
                    </View>

                    {item.description ? (
                      <MarkdownText style={styles.bodyText}>{item.description}</MarkdownText>
                    ) : null}

                    <Bullets items={item.bullets} />
                    <InlineTagList items={item.technologies} />
                  </View>
                ))}
              </View>
            </Section>
          </View>

          <View style={styles.rightColumn}>
            {data.education.length > 0 ? (
              <Section title="Educación">
                {data.education.map((item) => (
                  <View key={item.id} style={styles.sideItem}>
                    <Text style={styles.itemTitle}>{item.degree}</Text>
                    <Text style={styles.smallText}>{item.institution}</Text>
                    <Text style={styles.mutedText}>{dateRange(item.startDate, item.endDate)}</Text>
                    {item.description ? (
                      <MarkdownText style={styles.smallText}>{item.description}</MarkdownText>
                    ) : null}
                  </View>
                ))}
              </Section>
            ) : null}

            {data.skills.length > 0 ? (
              <Section title="Habilidades">
                {data.skills.map((category) => (
                  <View key={category.id} style={styles.sideItem}>
                    <Text style={styles.itemSubtitle}>{category.name}</Text>
                    <InlineTagList items={category.skills} />
                  </View>
                ))}
              </Section>
            ) : null}

            {data.languages.length > 0 ? (
              <Section title="Idiomas">
                {data.languages.map((item) => (
                  <View key={item.id} style={styles.languageRow}>
                    <Text style={styles.itemSubtitle}>{item.language}</Text>
                    <Text style={styles.smallText}>{item.level}</Text>
                  </View>
                ))}
              </Section>
            ) : null}

            {data.settings.showSpecializations && data.specializations.length > 0 ? (
              <Section title="Áreas de especialización">
                <Specializations items={data.specializations} />
              </Section>
            ) : null}
          </View>
        </View>
      </Page>
    </Document>
  )
}
