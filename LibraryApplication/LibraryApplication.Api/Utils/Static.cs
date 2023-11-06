using System.Text;

namespace LibraryApplication.Api.Utils
{
    public class Static
    {
        // source: https://stackoverflow.com/questions/249087/how-do-i-remove-diacritics-accents-from-a-string-in-net
        static readonly Dictionary<string, string> C_FOREIGN_CHARS = new Dictionary<string, string>
        {
            { "äæǽ", "ae" },
            { "öœ", "oe" },
            { "Ä", "Ae" },
            { "ÀÁÂÃÄÅǺĀĂĄǍΑΆẢẠẦẪẨẬẰẮẴẲẶА", "A" },
            { "àáâãåǻāăąǎªαάảạầấẫẩậằắẵẳặа", "a" },
            { "Б", "B" },
            { "б", "b" },
            { "ÇĆĈĊČ", "C" },
            { "çćĉċč", "c" },
            { "Д", "D" },
            { "д", "d" },
            { "ÐĎĐΔ", "Dj" },
            { "ðďđδ", "dj" },
            { "ÈÉÊËĒĔĖĘĚΕΈẼẺẸỀẾỄỂỆЕЭ", "E" },
            { "èéêëēĕėęěέεẽẻẹềếễểệеэ", "e" },
            { "Ф", "F" },
            { "ф", "f" },
            { "ĜĞĠĢΓГҐ", "G" },
            { "ĝğġģγгґ", "g" },
            { "ĤĦ", "H" },
            { "ĥħ", "h" },
            { "ÌÍÎÏĨĪĬǏĮİΗΉΊΙΪỈỊИЫ", "I" },
            { "ìíîïĩīĭǐįıηήίιϊỉịиыї", "i" },
            { "Ĵ", "J" },
            { "ĵ", "j" },
            { "ĶΚК", "K" },
            { "ķκк", "k" },
            { "ĹĻĽĿŁΛЛ", "L" },
            { "ĺļľŀłλл", "l" },
            { "М", "M" },
            { "м", "m" },
            { "ÑŃŅŇΝН", "N" },
            { "ñńņňŉνн", "n" },
            { "ÒÓÔÕŌŎǑŐƠØǾΟΌΩΏỎỌỒỐỖỔỘỜỚỠỞỢОÖ", "O" },
            { "òóôõōŏǒőơøǿºοόωώỏọồốỗổộờớỡởợоö", "o" },
            { "П", "P" },
            { "п", "p" },
            { "ŔŖŘΡР", "R" },
            { "ŕŗřρр", "r" },
            { "ŚŜŞȘŠΣС", "S" },
            { "śŝşșšſσςс", "s" },
            { "ȚŢŤŦτТ", "T" },
            { "țţťŧт", "t" },
            { "ÙÚÛŨŪŬŮŰŲƯǓǕǗǙǛŨỦỤỪỨỮỬỰУÜ", "U" },
            { "ùúûũūŭůűųưǔǖǘǚǜυύϋủụừứữửựуü", "u" },
            { "ÝŸŶΥΎΫỲỸỶỴЙ", "Y" },
            { "ýÿŷỳỹỷỵй", "y" },
            { "В", "V" },
            { "в", "v" },
            { "Ŵ", "W" },
            { "ŵ", "w" },
            { "ŹŻŽΖЗ", "Z" },
            { "źżžζз", "z" },
            { "ÆǼ", "AE" },
            { "ß", "ss" },
            { "Ĳ", "IJ" },
            { "ĳ", "ij" },
            { "Œ", "OE" },
            { "ƒ", "f" },
            { "ξ", "ks" },
            { "π", "p" },
            { "β", "v" },
            { "μ", "m" },
            { "ψ", "ps" },
            { "Ё", "Yo" },
            { "ё", "yo" },
            { "Є", "Ye" },
            { "є", "ye" },
            { "Ї", "Yi" },
            { "Ж", "Zh" },
            { "ж", "zh" },
            { "Х", "Kh" },
            { "х", "kh" },
            { "Ц", "Ts" },
            { "ц", "ts" },
            { "Ч", "Ch" },
            { "ч", "ch" },
            { "Ш", "Sh" },
            { "ш", "sh" },
            { "Щ", "Shch" },
            { "щ", "shch" },
            { "ЪъЬь", "" },
            { "Ю", "Yu" },
            { "ю", "yu" },
            { "Я", "Ya" },
            { "я", "ya" },
        };

        private static Dictionary<char, string> CForeignCharsMap;

        private static Dictionary<char, string> C_FOREIGN_CHARS_MAP
        {
            get
            {
                if (CForeignCharsMap == null)
                {
                    var dictionary = new Dictionary<char, string>();
                    foreach (var (key, value) in C_FOREIGN_CHARS)
                    {
                        // ReSharper disable once ForCanBeConvertedToForeach
                        for (var i = 0; i < key.Length; i++)
                        {
                            dictionary[key[i]] = value;
                        }
                    }
                    CForeignCharsMap = dictionary;
                }
                return CForeignCharsMap;
            }
        }
        /// <summary>
        /// Atkonvertal egy karaktert ekezetnelkulive
        /// </summary>
        /// <param name="character"></param>
        /// <returns></returns>
        public static string ConvertAccent(char character)
        {
            if (!C_FOREIGN_CHARS_MAP.TryGetValue(character, out var result)) result = character.ToString();
            return result;
        }
        /// <summary>
        /// Kicsereli az ekezeteket a szovegben ekezet nelkuli betukre
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string RemoveAccents(string text)
        {
            if (string.IsNullOrEmpty(text)) return text;
            var stringBuilder = new StringBuilder(text.Length);
            for (var i = 0; i < text.Length; i++)
            {
                stringBuilder.Append(ConvertAccent(text[i]));
            }
            return stringBuilder.ToString();
        }
    }
}
