
import fs from 'fs';
import pdfParse from 'pdf-parse';
export const parseResume = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}. Skipping resume parsing.`);
      return { text: '', skills: [], education: [], experience: 0 };
    }

    const dataBuffer = fs.readFileSync(filePath);
    const parsedData = await pdfParse(dataBuffer);
    const text = parsedData.text;

    // Extract skills (simple regex for lines starting with 'Skills' or containing comma-separated skills)
    let skills = [];
    const skillsMatch = text.match(/Skills\s*[:-]?\s*([\w\s,]+)/i);
    if (skillsMatch && skillsMatch[1]) {
      skills = skillsMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    }

    // Extract education (look for lines with degree keywords)
    const education = [];
    const educationRegex = /(Bachelor|Master|PhD|Diploma|Certificate|BSc|MSc|BA|MA|BS|MS)[^\n]*\n/gi;
    let eduMatch;
    while ((eduMatch = educationRegex.exec(text)) !== null) {
      education.push(eduMatch[0].trim());
    }

    // Extract years of experience (look for 'X years experience' or similar)
    let experience = 0;
    const expMatch = text.match(/(\d+)\s+years?\s+(of\s+)?experience/i);
    if (expMatch && expMatch[1]) {
      experience = parseInt(expMatch[1], 10);
    }

    return { text, skills, education, experience };
  } catch (error) {
    console.error(`Error parsing resume: ${error.message}`);
    // Return empty fields instead of throwing to prevent app crash
    return { text: '', skills: [], education: [], experience: 0 };
  }
};

// Enhance AI logic to recommend Gada levels
export const recommendGadaLevel = (skills, experience, certifications = []) => {
  if (certifications.includes('AWS Certified Solutions Architect') || skills.includes('Cloud Computing')) {
    return 'Expert Developer';
  }
  if (experience > 5 && skills.some(s => /lead|manager|architect/i.test(s))) {
    return 'Tech Lead';
  }
  if (experience > 3) {
    return 'Senior Developer';
  }
  if (experience > 1) {
    return 'Mid-Level Developer';
  }
  return 'Beginner';
};
