@Entity(tableName = "journal_pages")
public class JournalPageEntity {
    @PrimaryKey(autoGenerate = true)
    public long pageId;

    public long parentJournalId;
    public String contentJson;  // This is ENCRYPTED JSON now
    public long timestamp;
    public String mood;
    public String previewBase64;
}
