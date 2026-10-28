
import schoolData from "../data/school.json" with { type: "json" };

export function searchSchoolData(question) {
  // 質問を検索しやすい形にする
  const normalizedQuestion = question
    .toLowerCase()
    .replace(/[？?。、！!]/g, " ");

  // 日本語の言い換えを補う簡易辞書
  const synonyms = {
    "部活": ["部活動", "クラブ", "サークル"],
    "授業料": ["学費", "納入金"],
    "入試": ["受験", "試験", "募集要項"]
  };

  const expandedTerms = [normalizedQuestion];

  for (const [key, values] of Object.entries(synonyms)) {
    if (
      normalizedQuestion.includes(key) ||
      values.some((word) => normalizedQuestion.includes(word))
    ) {
      expandedTerms.push(key, ...values);
    }
  }

  // 学校データを採点する
  const results = schoolData.map((item) => {
    const text =
      `${item.category} ${item.title} ${item.content}`
        .toLowerCase();

    let score = 0;

    for (const term of expandedTerms) {
      const words = term
        .split(/[\s、。？！?!]+/)
        .filter((word) => word.length >= 2);

      for (const word of words) {
        if (text.includes(word)) {
          score += 1;
        }
      }
    }

    return { ...item, score };
  });

  // 関連する資料を最大3件返す
  return results
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score, ...item }) => item);
}
