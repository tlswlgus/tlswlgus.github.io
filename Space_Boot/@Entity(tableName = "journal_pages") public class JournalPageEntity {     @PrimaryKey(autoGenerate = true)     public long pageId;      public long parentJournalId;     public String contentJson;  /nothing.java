@Entity(tableName = "journal_pages")
public class JournalPageEntity {
    @PrimaryKey(autoGenerate = true)
    public long pageId;

    public long parentJournalId;
    public String contentJson; 
    public long timestamp;
    public String mood;
    public String previewBase64;
}

String rawJson = buildPageJson();
String encryptedJson = EncryptionHelper.encrypt(getContext(), rawJson);
page.contentJson = encryptedJson;

db.journalDAO().insertJournalPage(page);


String decryptedJson = EncryptionHelper.decrypt(getContext(), page.contentJson);
renderPage(decryptedJson);


public class EncryptionHelper {

    private static final String PREFS_NAME = "memoir_secure_prefs";
    private static final String PREF_KEY = "journal_aes_key";

    private static SecretKey getOrCreateKey(Context context) throws Exception {
        String masterKeyAlias = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC);

        EncryptedSharedPreferences prefs =
                (EncryptedSharedPreferences) EncryptedSharedPreferences.create(
                        PREFS_NAME,
                        masterKeyAlias,
                        context,
                        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
                );

        String stored = prefs.getString(PREF_KEY, null);

        if (stored == null) {
            KeyGenerator gen = KeyGenerator.getInstance("AES");
            gen.init(256);
            SecretKey key = gen.generateKey();
            prefs.edit().putString(PREF_KEY,
                    Base64.encodeToString(key.getEncoded(), Base64.NO_WRAP)).apply();
            return key;
        }

        return new SecretKeySpec(Base64.decode(stored, Base64.NO_WRAP), "AES");
    }

    public static String encrypt(Context context, String plain) throws Exception {
        SecretKey key = getOrCreateKey(context);

        Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
        c.init(Cipher.ENCRYPT_MODE, key);
        byte[] iv = c.getIV();
        byte[] enc = c.doFinal(plain.getBytes());

        byte[] out = new byte[iv.length + enc.length];
        System.arraycopy(iv, 0, out, 0, iv.length);
        System.arraycopy(enc, 0, out, iv.length, enc.length);

        return Base64.encodeToString(out, Base64.NO_WRAP);
    }

    public static String decrypt(Context context, String base64) throws Exception {
        SecretKey key = getOrCreateKey(context);

        byte[] data = Base64.decode(base64, Base64.NO_WRAP);

        byte[] iv = Arrays.copyOfRange(data, 0, 12);
        byte[] enc = Arrays.copyOfRange(data, 12, data.length);

        Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
        c.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(128, iv));
        return new String(c.doFinal(enc));
    }
}
