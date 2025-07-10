import { Textarea } from '@chakra-ui/react'

const TextAreaField = ({title}) => {
  return (
    <div>
     <Textarea placeholder={title} className="textarea_field"/>
    </div>
  );
};

export default TextAreaField;
