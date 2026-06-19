import type { VerseEntry } from "./types";

type VerseCategory = VerseEntry["category"];

type VerseSeed = {
  arabic: string;
  german: string;
  category: VerseCategory;
};

function transliterateArabic(input: string) {
  return input
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/آ/g, "aa")
    .replace(/[أإٱا]/g, "a")
    .replace(/ب/g, "b")
    .replace(/ت/g, "t")
    .replace(/ث/g, "th")
    .replace(/ج/g, "j")
    .replace(/ح/g, "h")
    .replace(/خ/g, "kh")
    .replace(/د/g, "d")
    .replace(/ذ/g, "dh")
    .replace(/ر/g, "r")
    .replace(/ز/g, "z")
    .replace(/س/g, "s")
    .replace(/ش/g, "sh")
    .replace(/ص/g, "s")
    .replace(/ض/g, "d")
    .replace(/ط/g, "t")
    .replace(/ظ/g, "z")
    .replace(/ع/g, "'")
    .replace(/غ/g, "gh")
    .replace(/ف/g, "f")
    .replace(/ق/g, "q")
    .replace(/ك/g, "k")
    .replace(/ل/g, "l")
    .replace(/م/g, "m")
    .replace(/ن/g, "n")
    .replace(/ه/g, "h")
    .replace(/ة/g, "a")
    .replace(/و/g, "w")
    .replace(/ى/g, "a")
    .replace(/ي/g, "y")
    .replace(/ؤ/g, "u")
    .replace(/ئ/g, "i")
    .replace(/ء/g, "'")
    .replace(/،/g, ",")
    .replace(/؛/g, ";")
    .replace(/؟/g, "?")
    .replace(/\s+/g, " ")
    .trim();
}

function makeVerse(seed: VerseSeed): VerseEntry {
  return {
    ...seed,
    franko: transliterateArabic(seed.arabic)
  };
}

const verseSeeds: VerseSeed[] = [
  {
    arabic: "الرب نوري وخلاصي فممن أخاف",
    german: "Der Herr ist Licht und Heil.",
    category: "Bibel"
  },
  {
    arabic: "الرب راعي فلا يعوزني شيء",
    german: "Der Herr ist mein Hirte.",
    category: "Bibel"
  },
  {
    arabic: "تعالوا إلي يا جميع المتعبين والثقيلي الأحمال وأنا أريحكم",
    german: "Kommt zu mir, alle Mühseligen.",
    category: "Bibel"
  },
  {
    arabic: "أنا قائم على الباب وأقرع",
    german: "Ich stehe an der Tür und klopfe.",
    category: "Agpeya"
  },
  {
    arabic: "لنقف بخوف الله ونسمع الإنجيل المقدس",
    german: "Mit Gottesfurcht zum Evangelium stehen.",
    category: "Agpeya"
  },
  {
    arabic: "فلنصمت الآن وقوفا بخشوع",
    german: "Still stehen in Ehrfurcht.",
    category: "Agpeya"
  },
  {
    arabic: "قدوس قدوس قدوس رب الصباؤوت",
    german: "Heilig, heilig, heilig.",
    category: "Basilius"
  },
  {
    arabic: "المجد لك يا رب",
    german: "Ehre sei dir, Herr.",
    category: "Basilius"
  },
  {
    arabic: "آمين يا رب",
    german: "Amen, o Herr.",
    category: "Kyrillos"
  },
  {
    arabic: "أنت هو الحق آمين",
    german: "Du bist die Wahrheit, Amen.",
    category: "Kyrillos"
  },
  {
    arabic: "من أجل النعمة والسلام والمحبة",
    german: "Um Gnade, Frieden und Liebe.",
    category: "Gregorios"
  },
  {
    arabic: "ارحمنا يا الله مخلصنا",
    german: "Erbarme dich unser, Gott.",
    category: "Gregorios"
  },
  {
    arabic: "أشرق علينا بنورك",
    german: "Lass dein Licht über uns leuchten.",
    category: "Bibel"
  },
  {
    arabic: "أعطنا سلامك يا رب",
    german: "Gib uns deinen Frieden, Herr.",
    category: "Agpeya"
  },
  {
    arabic: "يا ملك السلام امنحنا سلامك",
    german: "König des Friedens, schenke deinen Frieden.",
    category: "Agpeya"
  },
  {
    arabic: "يا رب القوات كن معنا",
    german: "Herr der Heerscharen, sei mit uns.",
    category: "Bibel"
  },
  {
    arabic: "عيناك تراني والليل كالنهار",
    german: "Deine Augen sehen mich.",
    category: "Bibel"
  },
  {
    arabic: "نرفع قلوبنا إلى فوق",
    german: "Erheben wir unsere Herzen.",
    category: "Agpeya"
  },
  {
    arabic: "اجعل يا رب كلمتك سراجا لرجلي",
    german: "Dein Wort sei eine Leuchte.",
    category: "Bibel"
  },
  {
    arabic: "فلنشكر الرب لأنه صالح",
    german: "Lasst uns danken, der Herr ist gut.",
    category: "Agpeya"
  },
  {
    arabic: "نشكر ربنا ومخلصنا يسوع المسيح",
    german: "Dank an unseren Herrn und Erlöser.",
    category: "Basilius"
  },
  {
    arabic: "السلام لجميعكم",
    german: "Friede sei mit euch allen.",
    category: "Kyrillos"
  },
  {
    arabic: "يا رب ارحم شعبك",
    german: "Herr, erbarme dich deines Volkes.",
    category: "Gregorios"
  },
  {
    arabic: "استنيروا بنور الرب",
    german: "Lasst euch vom Licht des Herrn erleuchten.",
    category: "Bibel"
  },
  {
    arabic: "أعنا يا رب لنسبحك بقلب واحد",
    german: "Hilf uns, dich mit einem Herzen zu preisen.",
    category: "Agpeya"
  },
  {
    arabic: "باسم الآب والابن والروح القدس الإله الواحد آمين",
    german: "Eröffnungsdoxologie.",
    category: "Agpeya"
  },
  {
    arabic: "المجد للآب والابن والروح القدس الآن وكل أوان وإلى دهر الدهور آمين",
    german: "Kleine Doxologie.",
    category: "Agpeya"
  },
  {
    arabic: "أبانا الذي في السموات",
    german: "Vater unser.",
    category: "Agpeya"
  },
  {
    arabic: "كما في السماء كذلك على الأرض",
    german: "Wie im Himmel so auf Erden.",
    category: "Agpeya"
  },
  {
    arabic: "خبزنا الذي للغد أعطنا اليوم",
    german: "Unser tägliches Brot.",
    category: "Agpeya"
  },
  {
    arabic: "وأغفر لنا ذنوبنا كما نغفر نحن أيضا للمذنبين إلينا",
    german: "Vergib uns, wie wir vergeben.",
    category: "Agpeya"
  },
  {
    arabic: "ولا تدخلنا في تجربة",
    german: "Führe uns nicht in Versuchung.",
    category: "Agpeya"
  },
  {
    arabic: "لكن نجنا من الشرير",
    german: "Erlöse uns vom Bösen.",
    category: "Agpeya"
  },
  {
    arabic: "بالمسيح يسوع ربنا لأن لك الملك والقوة والمجد إلى الأبد",
    german: "Durch Christus, unsern Herrn.",
    category: "Agpeya"
  },
  {
    arabic: "فلنشكر صانع الخيرات الرحوم الله، أبا ربنا وإلهنا ومخلصنا يسوع المسيح، لأنه سترنا وأعاننا، وحفظنا، وقبلنا إليه وأشفق علينا وعضدنا، وأتى بنا إلى هذه الساعة",
    german: "Dankgebet für Schutz und Hilfe.",
    category: "Agpeya"
  },
  {
    arabic: "هو أيضا فلنسأله أن يحفظنا في هذا اليوم المقدس وكل أيام حياتنا بكل سلام",
    german: "Bitte um Schutz und Frieden.",
    category: "Agpeya"
  },
  {
    arabic: "الضابط الكل الرب إلهنا",
    german: "Der Herr, der Allherrscher.",
    category: "Agpeya"
  },
  {
    arabic: "أيها السيد الإله ضابط الكل أبو ربنا وإلهنا ومخلصنا يسوع المسيح، نشكرك على كل حال ومن أجل كل حال، وفى كل حال، لأنك سترتنا، وأعنتنا، وحفظتنا، وقبلتنا إليك، وأشفقت علينا، وعضدتنا، وأتيت بنا إلى هذه الساعة",
    german: "Dank für Bewahrung in jeder Stunde.",
    category: "Agpeya"
  },
  {
    arabic: "من أجل هذا نسأل ونطلب من صلاحك يا محب البشر، امنحنا أن نكمل هذا اليوم المقدس وكل أيام حياتنا بكل سلام مع خوفك",
    german: "Bitte um einen friedlichen Tag.",
    category: "Agpeya"
  },
  {
    arabic: "كل حسد، وكل تجربة وكل فعل الشيطان ومؤامرة الناس الأشرار، وقيام الأعداء الخفيين والظاهريين، انزعها عنا وعن سائر شعبك، وعن موضعك المقدس هذا",
    german: "Bitte um Bewahrung vor allem Bösen.",
    category: "Agpeya"
  },
  {
    arabic: "أما الصالحات والنافعات فارزقنا إياها",
    german: "Schenke uns Gutes und Nützliches.",
    category: "Agpeya"
  },
  {
    arabic: "لأنك أنت الذي أعطيتنا السلطان أن ندوس الحيات والعقارب وكل قوة العدو",
    german: "Gott gibt Sieg über das Böse.",
    category: "Agpeya"
  },
  {
    arabic: "ولا تدخلنا في تجربة، لكن نجنا من الشرير",
    german: "Erlösung vom Bösen.",
    category: "Agpeya"
  },
  {
    arabic: "بالنعمة والرأفات ومحبة البشر اللواتي لابنك الوحيد ربنا وإلهنا ومخلصنا يسوع المسيح",
    german: "Durch Gnade und Menschenliebe Christi.",
    category: "Agpeya"
  },
  {
    arabic: "هذا الذي من قبله المجد والإكرام والعزة والسجود تليق بك معه مع الروح القدس المحيي المساوي لك الآن وكل أوان وإلى دهر الدهور آمين",
    german: "Doxologie an den dreieinigen Gott.",
    category: "Agpeya"
  },
  {
    arabic: "ارحمني يا الله كعظيم رحمتك، ومثل كثرة رأفتك تمحو إثمي",
    german: "Psalmwort um Erbarmen.",
    category: "Bibel"
  },
  {
    arabic: "اغسلني كثيرا من إثمي ومن خطيتي طهرني، لأني أنا عارف بإثمي وخطيتي أمامي في كل حين",
    german: "Bitte um Reinigung.",
    category: "Bibel"
  },
  {
    arabic: "لك وحدك أخطأت، والشر قدامك صنعت",
    german: "Bekenntnis der Sünde.",
    category: "Bibel"
  },
  {
    arabic: "لكي تتبرر في أقوالك",
    german: "Gerechtigkeit Gottes.",
    category: "Bibel"
  },
  {
    arabic: "وتغلب إذا حوكمتُ",
    german: "Gott bleibt gerecht im Urteil.",
    category: "Bibel"
  },
  {
    arabic: "لأني هاأنذا بالإثم حبل بي، وبالخطايا ولدتني أمي",
    german: "Menschliche Schwachheit.",
    category: "Bibel"
  },
  {
    arabic: "لأنك هكذا قد أحببت الحق، إذ أوضحت لي غوامض حكمتك ومستوراتها",
    german: "Gottes Wahrheit und Weisheit.",
    category: "Bibel"
  },
  {
    arabic: "تنضح على بزوفاك فأطهر، تغسلني فأبيض أكثر من الثلج",
    german: "Reinigung und neues Leben.",
    category: "Bibel"
  },
  {
    arabic: "تسمعني سرورا وفرحا، فتبتهج عظامي المنسحقة",
    german: "Freude nach der Vergebung.",
    category: "Bibel"
  },
  {
    arabic: "اصرف وجهك عن خطاياي، وامح كل آثامي",
    german: "Bitte um Vergebung.",
    category: "Bibel"
  },
  {
    arabic: "قلبا نقيا اخلق في يا الله، وروحا مستقيما جدده في أحشائي",
    german: "Neues Herz und neuer Geist.",
    category: "Bibel"
  },
  {
    arabic: "لا تطرحني من قدام وجهك وروحك القدوس لا تنزعه منى",
    german: "Bitte um Gottes Nähe.",
    category: "Bibel"
  },
  {
    arabic: "نجني من الدماء يا الله إله خلاصي، فيبتهج لساني بعدلك",
    german: "Rettung und Lob.",
    category: "Bibel"
  },
  {
    arabic: "يا رب افتح شفتي، فيخبر فمي بتسبيحك",
    german: "Öffne meine Lippen.",
    category: "Bibel"
  },
  {
    arabic: "لأنك لو آثرت الذبيحة لكنت الآن أعطي، ولكنك لا تسر بالمحرقات، فالذبيحة لله روح منسحق",
    german: "Wahrer Gottesdienst.",
    category: "Bibel"
  },
  {
    arabic: "أنعم يا رب بمسرتك على صهيون، ولتبن أسوار أورشليم",
    german: "Gebet für Zion.",
    category: "Bibel"
  },
  {
    arabic: "حينئذ تسر بذبائح البر قربانا ومحرقات ويقربون على مذابحك العجول",
    german: "Opfer des Lobes.",
    category: "Bibel"
  },
  {
    arabic: "هلم نسجد هلم نسأل المسيح إلهنا",
    german: "Aufforderung zum Gebet.",
    category: "Agpeya"
  },
  {
    arabic: "هلم نسجد، هلم نطلب من المسيح ملكنا",
    german: "Gebetsaufruf.",
    category: "Agpeya"
  },
  {
    arabic: "هلم نسجد، هلم نتضرع إلى المسيح مخلصنا",
    german: "Bitte an Christus.",
    category: "Agpeya"
  },
  {
    arabic: "يا ربنا يسوع المسيح كلمة الله إلهنا، بشفاعة القديسة مريم وجميع قديسيك، احفظنا ولنبدأ بدءا حسنا",
    german: "Bitte um guten Anfang.",
    category: "Agpeya"
  },
  {
    arabic: "ارحمنا كإرادتك إلى الأبد",
    german: "Erbarme dich nach deinem Willen.",
    category: "Agpeya"
  },
  {
    arabic: "الليل عبر، نشكرك يا رب ونسأل أن تحفظنا في هذا اليوم بغير خطية وأنقذنا",
    german: "Morgengebet um Bewahrung.",
    category: "Agpeya"
  },
  {
    arabic: "واحد هو الله أبو كل أحد",
    german: "Der eine Gott und Vater.",
    category: "Basilius"
  },
  {
    arabic: "واحد هو الروح القدس المعزى الواحد بأقنومه، منبثق من الآب، يطهر كل البرية",
    german: "Bekenntnis zum Heiligen Geist.",
    category: "Basilius"
  },
  {
    arabic: "يعلمنا أن نسجد للثالوث القدوس بلاهوت واحد وطبيعة واحدة، نسبحه ونباركه إلى الأبد",
    german: "Lobpreis des einen Gottes.",
    category: "Basilius"
  },
  {
    arabic: "صلاة باكر من النهار المبارك، أقدمها للمسيح ملكي وإلهي، وأرجوه أن يغفر لي خطاياي",
    german: "Morgengebet der ersten Stunde.",
    category: "Agpeya"
  },
  {
    arabic: "من مزامير معلمنا داود النبي بركاته علينا أمين",
    german: "Einleitung zu den Psalmen.",
    category: "Bibel"
  },
  {
    arabic: "طوبى للرجل الذي لم يسلك في مشورة المنافقين",
    german: "Selig der Gerechte.",
    category: "Bibel"
  },
  {
    arabic: "وفى طريق الخطاة لم يقف، وفى مجلس المستهزئين لم يجلس",
    german: "Nicht bei den Sündern verweilen.",
    category: "Bibel"
  },
  {
    arabic: "لكن في ناموس الرب إرادته، وفى ناموسه يلهج نهارا وليلا",
    german: "Meditation über das Gesetz.",
    category: "Bibel"
  },
  {
    arabic: "فيكون كالشجرة المغروسة على مجارى المياه التي تعطى ثمرها في حينه",
    german: "Bild vom fruchtbaren Baum.",
    category: "Bibel"
  },
  {
    arabic: "وورقها لا ينتثر، وكل ما يصنع ينجح فيه",
    german: "Der Gerechte bleibt standhaft.",
    category: "Bibel"
  },
  {
    arabic: "ليس كذلك المنافقون، ليس كذلك",
    german: "Nicht so die Gottlosen.",
    category: "Bibel"
  },
  {
    arabic: "لكنهم كالهباء الذي تذريه الريح عن وجه الأرض",
    german: "Wie Spreu vor dem Wind.",
    category: "Bibel"
  },
  {
    arabic: "فلهذا لا يقوم المنافقون في الدينونة، ولا الخطاة في مجمع الصديقين",
    german: "Die Gottlosen bestehen nicht.",
    category: "Bibel"
  },
  {
    arabic: "لأن الرب يعرف طريق الأبرار، وأما طريق المنافقين فتباد",
    german: "Gott kennt den Weg der Gerechten.",
    category: "Bibel"
  },
  {
    arabic: "قام ملوك الأرض وتآمر الرؤساء معا على الرب وعلى مسيحه قائلين: لنقطع أغلالهما، ولنطرح عنا نيرهما",
    german: "Auflehnung gegen den Herrn.",
    category: "Bibel"
  },
  {
    arabic: "حينئذ يكلمهم بغضبه، وبرجزه يرجفهم",
    german: "Gottes Antwort auf den Aufstand.",
    category: "Bibel"
  },
  {
    arabic: "أنا أقمته ملكا على صهيون جبل قدسه، لأكرز بأمر الرب",
    german: "Der König auf Zion.",
    category: "Bibel"
  },
  {
    arabic: "الرب قال لي: أنت ابني، وأنا اليوم ولدتك",
    german: "Sohnschaft des Messias.",
    category: "Bibel"
  },
  {
    arabic: "اسألني فأعطيك الأمم ميراثك، وسلطانك إلى أقطار الأرض",
    german: "Herrschaft über die Völker.",
    category: "Bibel"
  },
  {
    arabic: "لترعاهم بقضيب من حديد",
    german: "Starke Herrschaft.",
    category: "Bibel"
  },
  {
    arabic: "ومثل آنية الفخار تسحقهم",
    german: "Die Macht des Königs.",
    category: "Bibel"
  },
  {
    arabic: "فالآن أيها الملوك افهموا، وتأدبوا يا جميع قضاة الأرض اعبدوا الرب بخشية",
    german: "Mahnung an die Mächtigen.",
    category: "Bibel"
  },
  {
    arabic: "وهللوا له برعدة",
    german: "Freut euch mit Ehrfurcht.",
    category: "Bibel"
  },
  {
    arabic: "الزموا الأدب لئلا يغضب الرب فتضلوا عن طريق الحق",
    german: "Warnung vor Abirrung.",
    category: "Bibel"
  },
  {
    arabic: "يا رب لماذا كثر الذين يحزنونني، كثيرون قاموا علي",
    german: "Klage des Leidenden.",
    category: "Bibel"
  },
  {
    arabic: "كثيرون يقولون لنفسي، ليس له خلاص بإلهه",
    german: "Angriff auf den Glauben.",
    category: "Bibel"
  },
  {
    arabic: "أنت يا رب أنت هو ناصري، مجدي ورافع رأسي",
    german: "Gott als Schild und Ehre.",
    category: "Bibel"
  },
  {
    arabic: "بصوتي إلى الرب صرخت",
    german: "Ruf zum Herrn.",
    category: "Bibel"
  },
  {
    arabic: "فاستجاب لي من جبل قدسه",
    german: "Gott hört das Gebet.",
    category: "Bibel"
  },
  {
    arabic: "أنا اضطجعت ونمت، ثم استيقظت لأن الرب ناصري",
    german: "Ruhe in Gottes Schutz.",
    category: "Bibel"
  },
  {
    arabic: "فلا أخاف من ربوات الجموع المحيطين بي القائمين على",
    german: "Furchtlos in Bedrängnis.",
    category: "Bibel"
  },
  {
    arabic: "قم يا رب خلصني يا إلهي، لأنك ضربت كل من يعاديني باطلا",
    german: "Rettungsruf.",
    category: "Bibel"
  }
];

export const verses = verseSeeds.map(makeVerse);
