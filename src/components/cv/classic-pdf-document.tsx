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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionRule} />
      </View>
      {children}
    </View>
  )
}

function InlineTagList({ items }: { items: string[] }) {
  const filtered = items.filter(Boolean)
  if (filtered.length === 0) return null

  return (
    <Text style={styles.smallText}>
      {filtered.join(" | ")}
    </Text>
  )
}

function Specializations({ items }: { items: string[] }) {
  const filtered = items.filter(Boolean)
  if (filtered.length === 0) return null

  return (
    <View>
      {filtered.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.smallText}>{item}</Text>
        </View>
      ))}
    </View>
  )
}

function Bullets({ items }: { items: string[] }) {
  const bullets = items.filter(Boolean)
  if (bullets.length === 0) return null

  return (
    <View>
      {bullets.map((bullet) => (
        <View key={bullet} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <MarkdownText style={styles.bulletText}>{bullet}</MarkdownText>
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

  return (
    <Page size="A4" style={styles.page}>
      <View style={{ alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#d4d4d8", paddingBottom: 14 }}>
        <Text style={{ fontSize: 28, fontWeight: 700 }}>
          {data.personal.firstName} {data.personal.lastName}
        </Text>
        <Text style={{ marginTop: 6, color: "#3f3f46", fontSize: 12, fontWeight: 700 }}>
          {data.personal.professionalTitle}
        </Text>
        <Text style={{ marginTop: 8, color: "#52525b", fontSize: 8.5, lineHeight: 1.4, textAlign: "center" }}>
          {contactLine}
        </Text>
      </View>

      <View style={{ gap: 14, paddingTop: 18 }}>
        {data.summary.trim() ? (
          <Section title="Resumen profesional">
            <MarkdownText style={styles.bodyText}>{data.summary}</MarkdownText>
          </Section>
        ) : null}

        <Section title="Experiencia">
          <View style={styles.itemGroup}>
            {data.experience.map((item) => (
              <View key={item.id} style={styles.itemNoBorder}>
                <View style={styles.itemHeader}>
                  <View>
                    <Text style={styles.itemTitle}>{item.position}</Text>
                    <Text style={styles.itemSubtitle}>{item.company}</Text>
                    {item.location ? <Text style={styles.mutedText}>{item.location}</Text> : null}
                  </View>
                  <Text style={styles.date}>{dateRange(item.startDate, item.endDate, item.current)}</Text>
                </View>
                {item.description ? <MarkdownText style={styles.bodyText}>{item.description}</MarkdownText> : null}
                <Bullets items={item.bullets} />
                {item.technologies.length > 0 ? (
                  <Text style={styles.smallText}>{item.technologies.join(" | ")}</Text>
                ) : null}
              </View>
            ))}
          </View>
        </Section>

        <View style={{ flexDirection: "row", gap: 24 }}>
          <View style={{ flex: 1 }}>
            <Section title="Educación">
              {data.education.map((item) => (
                <View key={item.id} style={styles.sideItem}>
                  <Text style={styles.itemTitle}>{item.degree}</Text>
                  <Text style={styles.smallText}>{item.institution}</Text>
                  <Text style={styles.mutedText}>{dateRange(item.startDate, item.endDate)}</Text>
                </View>
              ))}
            </Section>
          </View>
          <View style={{ flex: 1 }}>
            <Section title="Habilidades">
              {data.skills.map((category) => (
                <Text key={category.id} style={styles.smallText}>
                  <Text style={styles.bold}>{category.name}: </Text>
                  {category.skills.join(", ")}
                </Text>
              ))}
            </Section>
          </View>
        </View>

        {(data.languages.length > 0 ||
          (data.settings.showSpecializations && data.specializations.length > 0)) ? (
          <View style={{ flexDirection: "row", gap: 24 }}>
            {data.languages.length > 0 ? (
              <View style={{ flex: 1 }}>
                <Section title="Idiomas">
                  <Text style={styles.smallText}>
                    {data.languages.map((item) => `${item.language}: ${item.level}`).join(" | ")}
                  </Text>
                </Section>
              </View>
            ) : null}

            {data.settings.showSpecializations && data.specializations.length > 0 ? (
              <View style={{ flex: 1 }}>
                <Section title="Áreas de especialización">
                  <Specializations items={data.specializations} />
                </Section>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </Page>
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
