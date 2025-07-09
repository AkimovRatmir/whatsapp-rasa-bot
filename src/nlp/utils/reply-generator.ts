export function generateReply(intent: string): string {
    switch (intent) {

    //hi and goodbye
      case 'greet':
        return 'Привет! Как я могу помочь?';
      case 'goodbye':
        return 'Пока! Хорошего дня!';


      case 'affirm':
        return 'Отлично!';

    //sections navigation
      case 'section_1_problem':
        return 'You are in section 1';
      case 'section_2_problem':
        return 'You are in section 2';
      case 'section_3_problem':
        return 'You are in section 3';
      case 'section_4_problem':
        return 'You are in section 4';


    
      default:
        return 'Извините, я вас не понял.';
    }
  }
  